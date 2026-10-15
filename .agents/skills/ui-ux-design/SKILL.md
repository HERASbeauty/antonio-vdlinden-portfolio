---
name: ui-ux-design
description: "Review UI/UX design for the Dutch V/D Linden Sloop landing page. Use when assessing brand consistency, visual hierarchy, responsive layouts, typography, spacing, image cropping, project galleries, navigation, or calls to action. Preserve the approved visual identity and report before redesigning."
user-invocable: true
---

# UI/UX Design

## Purpose and Activation

Use this skill for an explicitly requested visual or usability assessment, responsive-layout refinement, or approved design implementation. Discovery alone is not authorization to audit or redesign the website.

## Scope and Guardrails

- Read applicable repository/agent instructions and confirm the affected section and permission to edit.
- Keep Dutch-language content and the established navy, white, and orange identity. Consult the existing approved brand guide and landing-page references when relevant; do not replace the design system with a generic template.
- Preserve approved logo lettering and hero/About photographs. Do not trace, redesign, replace, or delete assets without permission.
- Use only supplied or explicitly approved photographs. Inspect what is visible before writing captions; do not invent projects, locations, customers, materials, or business claims.
- Work within HTML/CSS-only constraints. Do not introduce JavaScript, dependencies, libraries, or new font services without explicit authorization. Do not commit, push, or deploy.

## Assessment Workflow

1. Confirm the user's goal, primary visitor task, target section, and whether the request is review-only. Identify the existing design conventions locally.
2. Inspect the controlling markup/CSS and relevant reference imagery. Define a specific usability or layout hypothesis and the cheapest browser check that can disprove it.
3. Review hierarchy, typography, spacing, navigation, image composition, and calls to action across desktop, tablet, and mobile.
4. Describe reproducible issues with screenshots when available, not taste alone. Prefer the smallest improvement consistent with the existing page.
5. Stop for approval after an assessment. If implementation is authorized, make a scoped change and repeat the affected browser checks before broadening the work.

## Actionable Checklist

- Make page/section hierarchy clear through heading size, weight, contrast, and spacing. Keep descriptive copy subordinate to the relevant heading.
- Use a consistent spacing rhythm, alignment, content width, and control geometry. Avoid decorative containers, duplicated labels, unnecessary effects, and card-within-card layouts.
- Preserve readable Dutch text, reasonable line lengths, and stable line heights. Do not use viewport-width font sizing, negative letter spacing, or tiny text to force a fit.
- Test long Dutch words and labels. Allow wrapping without truncating essential meaning, overlapping neighbors, or shifting controls unexpectedly.
- Maintain coherent desktop, tablet, and mobile layouts. Suggested test widths are 1440, 1024, 768, 390, and 320 CSS pixels; inspect breakpoint boundaries too.
- Keep page-level horizontal overflow absent. Avoid fixed widths that exceed available space and layouts that rely on hiding broken content.
- Use consistent gallery image proportions and deliberate `object-fit`/`object-position`. Inspect each crop so machinery, people, and relevant work remain understandable; compare against the original.
- Prefer a curated selection of varied, authentic work stages over duplicate imagery. Ensure captions describe visible content accurately and concisely.
- For horizontal galleries, show roughly three cards on desktop, two on tablet, and slightly more than one on mobile. Show the first photo fully and communicate that more content exists.
- Verify any previous/next controls visibly advance horizontally, with usable boundary states, keyboard focus, touch targets, and access to the last image. Do not introduce nonfunctional controls to satisfy a visual mockup.
- Keep navigation destinations predictable. Align calls to action in wording, appearance, and actual destination; do not promise capabilities the page does not provide.
- Check hover, keyboard focus, disabled, loading, and validation states where applicable. Motion must be purposeful and respect reduced-motion preferences.

## Validation Methods

### Automated or Tool-Assisted

- Use existing editor diagnostics and HTML/CSS validators to detect structural or syntax problems.
- If browser automation already exists, check bounding boxes, overflow, image-loading success, and control behavior at the agreed widths. Save screenshots only where permitted.
- Treat screenshot differences as evidence for review, not automatic proof of good design. Do not install a browser framework or visual-test dependency without permission.

### Manual Browser Verification

- Inspect real browser renders at desktop, tablet, and mobile widths, including short/tall viewports and zoom. Confirm text fits, alignment is coherent, and controls remain reachable.
- Compare crops with source photographs and inspect image clarity on standard/high-density displays where available.
- Complete the visitor's primary journey, such as navigation to projects and the contact call to action. Check keyboard and touch as well as pointer input.
- Verify visual hierarchy, readability, consistency, and perceived complexity directly; source inspection cannot establish these qualities. State when only emulated devices were tested.

## Reporting Format

1. **Scope and visual baseline:** requested area, relevant references, and constraints.
2. **Findings:** priority, linked file/line, viewport/state, evidence, visitor impact, and smallest proposed improvement.
3. **Automated results:** checks actually executed and outcomes.
4. **Manual results:** layouts, crops, navigation journeys, and interaction states checked; screenshots if available.
5. **Approval and changes:** exact files changed only if authorized, outstanding decisions, and unverified conditions. Separate objective defects from optional design preferences.