---
name: web-performance
description: "Assess web performance for the V/D Linden Sloop HTML/CSS landing page. Use when reviewing image formats and compression, responsive images, lazy loading, layout shifts, LCP, CLS, INP, dependencies, or repeatable loading measurements. Do not install tools or optimize assets without authorization."
user-invocable: true
---

# Web Performance

## Purpose and Activation

Use this skill for an explicitly requested performance assessment, image-loading investigation, or approved optimization. Do not audit, run external services, or change assets just because the skill is available.

## Scope and Guardrails

- Read applicable instructions, confirm the requested surface, and distinguish measurement-only work from permission to implement changes.
- Preserve visual quality, accessibility, Dutch content, approved branding, and hero/About photographs. Do not replace originals or delete assets without approval and a complete reference check.
- Keep the HTML/CSS-first implementation. No new JavaScript, dependencies, libraries, build pipeline, or third-party services unless explicitly authorized; existing scripts are not permission to add more.
- Use installed tools first. Report unavailable measurements instead of silently installing packages or inventing numbers. Do not commit, push, or deploy.

## Assessment Workflow

1. Record the tested URL, environment (local/staging/production), browser and tool versions, viewport, device pixel ratio, cache state, and network/CPU conditions.
2. Inspect the requested loading path: HTML, stylesheet references, critical hero imagery, below-the-fold images, and existing scripts. Identify the likely bottleneck without scanning unrelated code unnecessarily.
3. Establish a repeatable baseline with available tools. Record resource sizes and timings separately; compressed file size alone is not a loading-performance result.
4. Form one measurable hypothesis, such as oversized gallery candidates or a missing image size reservation. Propose the smallest change that addresses it.
5. For a review, report and wait. For an authorized optimization, retain originals, verify generated assets/references, and repeat the same measurement conditions to compare results.

## Actionable Checklist

- Use appropriate photographic formats such as supplied WebP. Consider alternatives only when supported, authorized, and measurably beneficial; do not re-encode already suitable imagery without a reason.
- Match image dimensions to rendered size and expected display density. Inspect compression quality, fine detail, faces, and machinery before accepting smaller derivatives.
- Use `srcset`/`sizes` when they meaningfully reduce downloads. Ensure candidate width descriptors match actual files, `sizes` approximates the layout, and browser `currentSrc` reflects the expected choice.
- Give images explicit intrinsic `width`/`height` or a reliable reserved aspect ratio. Maintain stable card/control dimensions to prevent layout shifts.
- Lazy-load below-the-fold images and consider asynchronous decoding. Do not lazy-load the critical hero image or any confirmed LCP candidate.
- Check critical-image discovery and request priority in the network panel. Add preload or `fetchpriority` only when evidence supports it and an HTML change is authorized; avoid competing high-priority downloads.
- Keep hero/About originals unchanged unless specifically approved. Any new derivatives must be separate files; inventory references before proposing removal of older files.
- Minimize blocking resources, duplicated requests, unnecessary font weights, and third-party requests. Do not add a framework, icon bundle, or runtime merely for a small effect.
- Inspect existing script work for long tasks affecting interactions. Prefer HTML/CSS solutions, but do not remove required existing behavior under the guise of optimization.
- Keep gallery scrolling responsive, images loading near the viewport, and navigation free of layout thrashing. Test while loading as well as after loading.
- Treat hosting compression, cache headers, and CDN behavior as environment-dependent. Do not assume the local development server represents production.

## Core Web Vitals

- **LCP (Largest Contentful Paint):** good is at most 2.5 seconds. Identify the actual largest content element and its loading/rendering stages; do not assume it is always the hero.
- **CLS (Cumulative Layout Shift):** good is at most 0.1. Inspect image/font loading and interaction-related layout instability, not only the initial screenshot.
- **INP (Interaction to Next Paint):** good is at most 200 milliseconds. Exercise real interactions; an idle page cannot demonstrate good INP.
- These thresholds describe field performance at the 75th percentile, evaluated for mobile and desktop separately. Lab measurements are diagnostic, not proof that the site passes field Core Web Vitals.
- Lighthouse Total Blocking Time is a lab diagnostic, not INP. Do not relabel it or invent INP when no suitable interaction/field measurement exists.

## Validation Methods

### Automated or Tool-Assisted

- Use existing validators and image metadata tools to check file formats, dimensions, bytes, responsive candidates, and HTTP success. Compare hashes when claiming originals were preserved.
- If available, use browser DevTools, an existing Lighthouse installation, or existing automation. No tool installation without permission.
- Repeat at least three comparable lab runs when timing measurements are available; report the median, range, exact settings, and raw metric names. Separate cold and warm cache runs.
- Record transferred bytes separately from decoded image dimensions and memory cost. Verify every referenced original/derivative loads successfully.
- Use production field data only when the actual domain and access are confirmed. If no data exists, mark field LCP/CLS/INP as unverified.

### Manual Browser Verification

- Inspect a cold load on desktop and mobile under stated throttling. Watch image appearance, reserved space, text rendering, and visible shifts.
- Scroll to lazy-loaded content and through the full gallery. Do not wait for offscreen lazy images without first bringing them near view; use bounded waits in automation.
- Check browser `currentSrc`, network requests, request priorities, and downloaded sizes at relevant viewports/display densities.
- Exercise keyboard, touch, buttons, and form interactions while observing responsiveness. Inspect visual quality and reduced-motion behavior after any authorized optimization.

## Reporting Format

1. **Environment and method:** URL, versions, viewports, density, throttling, cache, run count, and whether results are lab or field.
2. **Baseline:** bytes, requests, measured metrics, median/range, and unavailable measurements.
3. **Findings:** priority, linked file/line or resource, evidence, visitor impact, and proposed remedy.
4. **Validation:** automated checks and manual browser observations in separate lists; before/after comparisons only for executed equivalent tests.
5. **Asset/change inventory:** exact added/changed files, preserved originals, proposed removals pending approval, and remaining risks. Never present a local score as a production guarantee.