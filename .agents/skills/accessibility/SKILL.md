---
name: accessibility
description: "Assess WCAG 2.2 AA accessibility for the Dutch V/D Linden Sloop landing page. Use when reviewing semantic HTML, headings, keyboard navigation, focus, horizontal galleries, forms, alternative text, contrast, or reduced motion. Report findings before making changes."
user-invocable: true
---

# Accessibility

## Purpose and Activation

Use this skill for an explicitly requested accessibility review or accessibility-related implementation. Target WCAG 2.2 AA; an automated pass is not a conformance claim. Do not run an audit merely because this file was created or discovered.

## Scope and Guardrails

- Read applicable repository and agent instructions before assessment. Confirm the requested section and whether the task is assessment-only or implementation.
- Preserve Dutch visible copy, the navy/white/orange identity, approved assets, and existing hero/About photographs unless changes are authorized.
- Respect the HTML/CSS-only constraint. Do not add JavaScript, libraries, dependencies, or external testing services without explicit permission. Existing scripts do not authorize new ones.
- Do not change unrelated sections, delete assets, commit, push, or deploy. Report blockers rather than silently expanding scope.

## Assessment Workflow

1. Record the files, sections, browser, viewport sizes, available tools, and relevant interaction states. Separate source inspection from observed behavior.
2. Trace the local markup and CSS controlling the requested interaction. Identify one concrete risk and a focused check before proposing a change.
3. Complete available automated checks, then the manual browser checklist. Use existing tooling; do not install missing tools automatically.
4. Record reproducible findings with evidence, affected users, relevant WCAG criteria, and the smallest practical remedy.
5. Stop at the report for an assessment-only request. For authorized changes, rerun the focused failing check and related manual verification.

## Actionable Checklist

- Use semantic landmarks, native controls, a meaningful page heading, and logical heading levels. Provide a working skip link where appropriate.
- Keep DOM, reading, and focus order coherent; avoid positive `tabindex` and interactive elements built from non-interactive markup.
- Make navigation reachable with Tab and Shift+Tab. Verify Enter/Space behavior, absence of keyboard traps, visible focus, and focus not obscured by other content.
- Meet WCAG 2.2 AA target-size requirements: at least 24 by 24 CSS pixels or a valid spacing/other exception. Prefer 44 by 44 for touch controls where practical.
- Give a scrollable horizontal gallery an accessible name and keyboard access. Verify first/last photos, touch scrolling, and any previous/next controls without vertical jumps or page overflow.
- Use correctly named gallery buttons with clear boundary states. If dynamic status already exists, check its accuracy and avoid excessively frequent announcements. No automatic rotation without appropriate controls.
- Associate every form control with a persistent label. Use suitable input types, autocomplete, and textual required-field instructions; placeholders are not labels.
- Test empty and invalid submissions. Identify errors in text, associate feedback with fields, preserve entered values, and expose status accessibly. Do not imply a prototype form sends data.
- Write meaningful Dutch alt text for informative photographs based on visible content. Use empty alt for decorative images; avoid filenames, keyword stuffing, and invented details.
- Check text contrast of 4.5:1, or 3:1 for qualifying large text. Check required non-text control/state contrast of 3:1. Do not communicate state through color alone.
- Verify reflow at 320 CSS pixels and zoom/text resizing without lost content. Two-dimensional content exceptions do not excuse general page overflow.
- Honor `prefers-reduced-motion`; remove unnecessary animation or smooth scrolling in reduced-motion mode. Avoid flashing content.

## Validation Methods

### Automated or Tool-Assisted

- Run available HTML validation and editor diagnostics for malformed structure, duplicate IDs, missing attributes, and invalid ARIA relationships.
- Use an already available accessibility scanner on the requested section and record tool/version, rules, browser, and results. Contrast calculations are tool-assisted, not a substitute for reviewing all states.
- If existing browser automation is available, assert keyboard reachability, image loading, gallery bounds, and absence of page overflow. Record the actual viewports, not just device labels.
- Mark a missing tool or an unexecuted check as **not run**. Never infer keyboard or screen-reader usability solely from source or a scanner.

### Manual Browser Verification

- Test desktop, tablet, and mobile layouts; suggested widths are 1440, 1024, 768, 390, and 320 CSS pixels. Check zoom and text resizing separately.
- Traverse the scoped controls with a keyboard, inspect visible focus, and verify gallery gestures on a touch device or touch-enabled browser. Label emulation as emulation.
- Exercise form errors, disabled/boundary states, long labels, and reduced motion.
- With an available screen reader, inspect landmarks, heading navigation, image descriptions, control names, errors, and announcements. If unavailable, explicitly leave screen-reader verification pending.

## Reporting Format

1. **Scope:** files/sections reviewed, assessment or implementation, and environment.
2. **Findings:** severity, linked file/line, reproduction, expected/observed behavior, affected users, WCAG criterion, and proposed remedy.
3. **Automated results:** exact checks executed, outcomes, and tool limitations.
4. **Manual results:** viewports, keyboard/touch/screen-reader checks, and observations; clearly list unverified states.
5. **Changes and approval:** exact changed files if authorized, remaining risks, and decisions needed. Do not claim WCAG certification or full compliance.