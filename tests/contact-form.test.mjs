import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const endpoint = 'https://formspree.io/f/mljgabdv';
const html = await readFile(join(root, 'index.html'), 'utf8');
const handler = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];

function setup(response, valid = true) {
  const events = {};
  const requests = [];
  const attributes = new Map();
  const fields = { name: 'Test Aanvraag', email: 'visitor@example.invalid', telefoon: '0612345678', onderwerp: 'Sloopwerk', message: 'Gesimuleerde aanvraag, niet bezorgen.', _gotcha: '' };
  const button = { textContent: 'Offerte aanvragen', disabled: false, setAttribute: (name, value) => attributes.set(name, value), removeAttribute: name => attributes.delete(name) };
  const status = { textContent: '', focus() { this.focused = true; } };
  const form = {
    action: endpoint,
    querySelector: () => button,
    addEventListener: (name, callback) => { events[name] = callback; },
    reportValidity: () => valid,
    reset() { Object.keys(fields).forEach(name => { fields[name] = ''; }); this.resetCalled = true; }
  };
  let timeoutCallback;
  let timeoutCleared = false;
  runInNewContext(handler, {
    document: { getElementById: id => id === 'quote-form' ? form : status },
    AbortController,
    FormData: class extends FormData {
      constructor(source) {
        super();
        assert.equal(source, form);
        Object.entries(fields).forEach(([name, value]) => this.append(name, value));
      }
    },
    setTimeout: (callback, delay) => { assert.equal(delay, 20000); timeoutCallback = callback; return 1; },
    clearTimeout: () => { timeoutCleared = true; },
    fetch: async (url, options) => { requests.push({ url, ...options }); return response(options); }
  });
  return { events, requests, attributes, fields, button, status, form, submit: () => events.submit({ preventDefault() {} }), expire: () => timeoutCallback(), cleared: () => timeoutCleared };
}

for (const code of [200, 201, 400, 422, 429, 500, 503]) {
  test(`mocked HTTP ${code}: POST, payload, acceptance, data retention and accessible status focus`, async () => {
    const accepted = code >= 200 && code < 300;
    const state = setup(async () => ({ ok: accepted, status: code }));
    const submission = state.submit();
    assert.equal(state.button.disabled, true);
    assert.equal(state.attributes.get('aria-busy'), 'true');
    assert.match(state.status.textContent, /wordt verzonden/);
    await submission;
    const request = state.requests[0];
    assert.equal(request.url, endpoint);
    assert.equal(request.method, 'POST');
    assert.equal(request.headers.Accept, 'application/json');
    assert.deepEqual(Object.fromEntries(request.body), { name: 'Test Aanvraag', email: 'visitor@example.invalid', telefoon: '0612345678', onderwerp: 'Sloopwerk', message: 'Gesimuleerde aanvraag, niet bezorgen.', _gotcha: '' });
    assert.equal(state.requests.length, 1);
    assert.equal(!!state.form.resetCalled, accepted);
    assert.equal(state.fields.name, accepted ? '' : 'Test Aanvraag');
    assert.equal(state.fields.email, accepted ? '' : 'visitor@example.invalid');
    assert.equal(state.fields.message, accepted ? '' : 'Gesimuleerde aanvraag, niet bezorgen.');
    assert.equal(state.status.textContent.startsWith('Bedankt!'), accepted);
    assert.equal(state.status.focused, true);
    assert.equal(state.button.disabled, false);
    assert.equal(state.button.textContent, 'Offerte aanvragen');
    assert.equal(state.attributes.has('aria-busy'), false);
    assert.equal(state.cleared(), true);
  });
}

test('mocked native validation failure prevents requests and reports Dutch guidance', async () => {
  const state = setup(() => assert.fail('Must not call Fetch'), false);
  state.events.invalid();
  await state.submit();
  assert.match(state.status.textContent, /verplichte velden.*geldig e-mailadres/);
  assert.equal(state.requests.length, 0);
  assert.equal(state.fields.name, 'Test Aanvraag');
});

test('mocked network failure preserves data, never reports success and permits retry', async () => {
  const state = setup(async () => { throw new TypeError('Offline'); });
  await state.submit();
  assert.match(state.status.textContent, /internetverbinding/);
  assert.equal(state.fields.message, 'Gesimuleerde aanvraag, niet bezorgen.');
  assert.equal(state.form.resetCalled, undefined);
  assert.equal(state.button.disabled, false);
  await state.submit();
  assert.equal(state.requests.length, 2);
  assert.equal(state.status.focused, true);
});

test('mocked timeout aborts Fetch, retains data and reports unconfirmed receipt', async () => {
  const state = setup(options => new Promise((resolveResponse, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')));
  }));
  const submission = state.submit();
  state.expire();
  await submission;
  assert.match(state.status.textContent, /duurt te lang; ontvangst is niet bevestigd/);
  assert.equal(state.fields.message, 'Gesimuleerde aanvraag, niet bezorgen.');
  assert.equal(state.form.resetCalled, undefined);
  assert.equal(state.button.disabled, false);
  assert.equal(state.cleared(), true);
});

test('mocked repeated submission while pending sends exactly one request', async () => {
  let accept;
  const state = setup(() => new Promise(resolveResponse => { accept = resolveResponse; }));
  const submission = state.submit();
  await state.submit();
  await state.submit();
  assert.equal(state.requests.length, 1);
  assert.equal(state.button.disabled, true);
  accept({ ok: true, status: 200 });
  await submission;
  assert.equal(state.button.disabled, false);
  assert.equal(state.form.resetCalled, true);
});

test('contact form, accessibility and gallery browser regressions (mocked delivery only)', { timeout: 90000, skip: process.env.RUN_BROWSER_TESTS !== '1' ? 'Opt-in: RUN_BROWSER_TESTS=1; requires a working existing Chromium (no installation performed)' : false }, async () => {
  const cache = join(process.env.HOME, '.cache/ms-playwright');
  const chromium = (await readdir(cache)).find(name => name.startsWith('chromium-'));
  const executable = process.env.CHROMIUM_PATH || join(cache, chromium || '', 'chrome-linux64/chrome');
  const temporary = await mkdtemp(join(tmpdir(), 'vdlinden-form-'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filename = resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`);
      if (!filename.startsWith(`${root}/`)) throw new Error('Invalid path');
      const content = await readFile(filename);
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.webp': 'image/webp', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png' };
      response.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream' });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  let browser;
  let socket;
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = spawn(executable, ['--headless', '--no-sandbox', '--disable-gpu', '--disable-background-networking', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${temporary}/profile`, 'about:blank']);
    const websocketUrl = await new Promise((resolveUrl, reject) => {
      let output = '';
      browser.stderr.on('data', chunk => {
        output += chunk;
        const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) resolveUrl(match[1]);
      });
      browser.once('error', reject);
      browser.once('exit', code => reject(new Error(`Chromium exited: ${code}`)));
    });
    socket = new WebSocket(websocketUrl);
    await once(socket, 'open');
    let sequence = 0;
    const pending = new Map();
    const listeners = new Map();
    const command = (method, params = {}, sessionId) => new Promise((resolveResult, reject) => {
      const id = ++sequence;
      pending.set(id, { resolveResult, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const callback = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) callback.reject(new Error(JSON.stringify(message.error)));
        else callback.resolveResult(message.result);
      } else {
        for (const listener of listeners.get(message.method) || []) listener(message.params);
      }
    });
    const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
    const send = (method, params) => command(method, params, sessionId);
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const browserErrors = [];
    listeners.set('Runtime.exceptionThrown', [event => browserErrors.push(event.exceptionDetails.text)]);
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    const requests = [];
    const blocked = [];
    let mode = 200;
    let held;
    let interceptionError;
    const fulfill = (requestId, status) => send('Fetch.fulfillRequest', {
      requestId, responseCode: status,
      responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      body: Buffer.from(JSON.stringify(status === 200 ? { ok: true } : { errors: [{ field: 'email', message: 'Rejected' }] })).toString('base64')
    });
    listeners.set('Fetch.requestPaused', [event => {
      (async () => {
        if (event.request.url.startsWith(`${origin}/`)) {
          await send('Fetch.continueRequest', { requestId: event.requestId });
        } else if (event.request.url === endpoint) {
          requests.push(event.request);
          if (mode === 'held' || mode === 'timeout') held = event.requestId;
          else if (mode === 'network') await send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'InternetDisconnected' });
          else await fulfill(event.requestId, mode);
        } else {
          blocked.push(event.request.url);
          await send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' });
        }
      })().catch(error => { interceptionError = error; });
    }]);
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `
      const originalTimeout = window.setTimeout;
      window.setTimeout = (callback, delay, ...args) => originalTimeout(callback, window.shortenFormTimeout && delay === 20000 ? 100 : delay, ...args);
    ` });
    await send('Page.navigate', { url: origin });
    await evaluate(`new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    })`);
    const fill = () => evaluate(`(() => {
      const form = document.getElementById('quote-form');
      form.elements.name.value = 'Test Aanvraag';
      form.elements.email.value = 'visitor@example.invalid';
      form.elements.telefoon.value = '0612345678';
      form.elements.onderwerp.value = 'Sloopwerk';
      form.elements.message.value = 'Gesimuleerde aanvraag, niet bezorgen.';
    })()`);
    const settled = () => evaluate(`new Promise((resolve, reject) => {
      const form = document.getElementById('quote-form');
      const button = form.querySelector('button');
      const finish = () => {
        if (button.disabled) return;
        observer.disconnect();
        clearTimeout(timer);
        resolve({ text: document.getElementById('form-note').textContent, name: form.elements.name.value, email: form.elements.email.value, message: form.elements.message.value, focus: document.activeElement.id });
      };
      const observer = new MutationObserver(finish);
      observer.observe(form, { subtree: true, attributes: true, childList: true, characterData: true });
      const timer = setTimeout(() => { observer.disconnect(); reject(new Error('Form did not settle')); }, 5000);
      finish();
    })`);
    const submit = () => evaluate(`document.getElementById('quote-form').requestSubmit()`);
    const key = async value => {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: value, windowsVirtualKeyCode: value === 'Tab' ? 9 : value === 'Enter' ? 13 : undefined });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: value });
    };

    assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('#quote-form .form-fields input, #quote-form select, #quote-form textarea'), field => [field.name, !!field.labels.length])`), [['name', true], ['email', true], ['telefoon', true], ['onderwerp', true], ['message', true]]);
    assert.deepEqual(await evaluate(`(() => { const note = document.getElementById('form-note'); return [note.role, note.getAttribute('aria-live'), note.getAttribute('aria-atomic'), note.tabIndex]; })()`), ['status', 'polite', 'true', -1]);
    assert.equal(await evaluate(`document.querySelector('[name="_gotcha"]').getClientRects().length`), 0);
    await submit();
    assert.equal(requests.length, 0);
    assert.equal(await evaluate(`document.activeElement.name`), 'name');
    await fill();
    await evaluate(`document.querySelector('[name="email"]').value = 'ongeldig'`);
    await submit();
    assert.equal(requests.length, 0);
    assert.equal(await evaluate(`document.activeElement.name`), 'email');
    assert.match(await evaluate(`document.getElementById('form-note').textContent`), /geldig e-mailadres/);
    console.log('PASS native required/email validation, labels, honeypot and live-region semantics');

    for (const scenario of [200, 400, 422, 429, 500, 503, 'network', 'timeout']) {
      mode = scenario;
      await fill();
      await evaluate(`window.shortenFormTimeout = ${scenario === 'timeout'}`);
      const count = requests.length;
      await submit();
      const result = await settled();
      assert.equal(requests.length, count + 1);
      const request = requests.at(-1);
      assert.equal(request.method, 'POST');
      assert.equal(Object.entries(request.headers).find(([name]) => name.toLowerCase() === 'accept')[1], 'application/json');
      for (const [name, value] of [['name', 'Test Aanvraag'], ['email', 'visitor@example.invalid'], ['telefoon', '0612345678'], ['onderwerp', 'Sloopwerk'], ['message', 'Gesimuleerde aanvraag, niet bezorgen.'], ['_gotcha', '']]) {
        assert.ok(request.postData.includes(`name="${name}"\r\n\r\n${value}\r\n`), `Missing payload ${name}`);
      }
      assert.equal(result.text.startsWith('Bedankt!'), scenario === 200);
      assert.equal(result.name, scenario === 200 ? '' : 'Test Aanvraag');
      assert.equal(result.email, scenario === 200 ? '' : 'visitor@example.invalid');
      assert.equal(result.message, scenario === 200 ? '' : 'Gesimuleerde aanvraag, niet bezorgen.');
      assert.equal(result.focus, 'form-note');
      console.log(`PASS mocked ${scenario}: endpoint, multipart payload, Accept, status, reset policy and focus`);
    }

    mode = 'held';
    await evaluate('window.shortenFormTimeout = false');
    await fill();
    const beforeDuplicate = requests.length;
    await submit();
    await evaluate(`(() => { const form = document.getElementById('quote-form'); form.querySelector('button').click(); form.requestSubmit(); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); })()`);
    assert.equal(requests.length, beforeDuplicate + 1);
    assert.equal(await evaluate(`document.querySelector('#quote-form button').disabled`), true);
    await fulfill(held, 200);
    await settled();
    mode = 200;
    await fill();
    await evaluate(`document.querySelector('[name="name"]').focus()`);
    for (const name of ['email', 'telefoon', 'onderwerp', 'message']) {
      await key('Tab');
      assert.equal(await evaluate('document.activeElement.name'), name);
    }
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.type'), 'submit');
    await key('Enter');
    assert.match((await settled()).text, /^Bedankt!/);
    console.log('PASS repeated clicks/programmatic submits and full keyboard submission');

    const expectedLinks = ['tel:+31681105719', 'mailto:info@vdlindensloop.nl', 'https://www.facebook.com/vdLindenSloopenbeton/', 'https://www.instagram.com/antoniocroes/', 'https://vimeo.com/914183106?share=copy#t=0'];
    const links = await evaluate(`Array.from(document.querySelectorAll('a'), anchor => anchor.getAttribute('href'))`);
    expectedLinks.forEach(link => assert.ok(links.includes(link), `Missing contact/social link ${link}`));
    assert.equal(await evaluate(`document.documentElement.lang`), 'nl');
    assert.equal(await evaluate(`document.querySelectorAll('[id]').length === new Set(Array.from(document.querySelectorAll('[id]'), element => element.id)).size`), true);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `Page overflow at ${width}`);
      for (const scenario of [200, 503]) {
        mode = scenario;
        await fill();
        await submit();
        await settled();
        const fits = await evaluate(`Array.from(document.querySelectorAll('#quote-form, #quote-form label, #quote-form input:not([hidden]), #quote-form select, #quote-form textarea, #quote-form button, #form-note'), element => {
          const box = element.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1;
        }).every(Boolean)`);
        assert.equal(fits, true, `Form overflow at ${width}, state ${scenario}`);
      }
      await evaluate(`document.getElementById('quote-form').scrollIntoView({ block: 'center' })`);
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(join(temporary, `contact-${width}.png`), Buffer.from(data, 'base64'));
      await evaluate(`document.getElementById('project-gallery').focus()`);
      await key('Home');
      await evaluate(`new Promise(resolve => setTimeout(resolve, 250))`);
      assert.equal(await evaluate(`document.getElementById('project-gallery').scrollLeft`), 0);
      assert.equal(await evaluate(`document.querySelector('[data-direction="-1"]').getAttribute('aria-disabled')`), 'true');
      await evaluate(`document.querySelector('[data-direction="1"]').click()`);
      await evaluate(`new Promise(resolve => setTimeout(resolve, 250))`);
      assert.ok(await evaluate(`document.getElementById('project-gallery').scrollLeft > 0`));
      await key('End');
      await evaluate(`new Promise(resolve => setTimeout(resolve, 250))`);
      assert.equal(await evaluate(`document.querySelector('[data-direction="1"]').getAttribute('aria-disabled')`), 'true');
      assert.match(await evaluate(`document.querySelector('.project-position').textContent`), /8 van 8/);
      assert.equal(await evaluate(`Array.from(document.querySelectorAll('#project-gallery img'), image => image.complete && image.naturalWidth > 0).every(Boolean)`), true);
      console.log(`PASS ${width}px: success/error layout, screenshot, gallery arrows/Home/End, boundary states and images`);
    }
    assert.equal(interceptionError, undefined);
    assert.deepEqual(browserErrors, []);
    assert.deepEqual(blocked, []);
    console.log(`PASS links, Dutch language, unique IDs, no runtime errors; ${requests.length} mocked requests, zero real Formspree submissions`);
    console.log(`Screenshots: ${temporary}/contact-*.png`);
  } finally {
    socket?.close();
    if (browser && browser.exitCode === null) {
      browser.kill('SIGTERM');
      await once(browser, 'exit');
    }
    await new Promise(resolveClose => server.close(resolveClose));
    await rm(join(temporary, 'profile'), { recursive: true, force: true });
  }
});