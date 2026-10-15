---
name: technical-seo
description: "Review technical SEO for the Dutch V/D Linden Sloop landing page. Use when assessing Dutch metadata, page titles, descriptions, headings, image filenames and alt text, crawlability, canonical URLs, structured data, or confirmed local service areas. Never fabricate business information or assume a production domain."
user-invocable: true
---

# Technical SEO

## Purpose and Activation

Use this skill for an explicitly requested technical SEO assessment or approved implementation. Skill discovery does not authorize a website audit, publication, metadata changes, or external submissions.

## Scope and Guardrails

- Read applicable instructions and confirm whether the task is review-only or implementation. Keep the website Dutch-language and within the authorized section/files.
- Respect HTML/CSS-only constraints. Do not introduce JavaScript, packages, SEO libraries, or external services without explicit authorization.
- Do not change approved branding or hero/About photographs. Do not rename/delete assets without checking all references and obtaining permission.
- Business facts are evidence-gated: do not fabricate phone numbers, email addresses, street addresses, cities, service areas, opening hours, project locations, prices, turnaround times, certifications, reviews, ratings, or claims.
- Use only explicitly confirmed production domain and business information. A repository name, localhost address, Codespaces preview URL, screenshot, or mockup is not confirmation.
- Do not commit, push, deploy, submit sitemaps, request indexing, or modify external accounts without explicit authorization.

## Assessment Workflow

1. Confirm the target URL/environment and requested assessment scope. Gather the user's confirmed business facts and production domain, recording unknowns explicitly.
2. Inspect page metadata, headings, crawlable content/links, image references, and any existing canonical or structured data within scope. Distinguish source evidence from live HTTP/browser observations.
3. Run available static checks and, only when authorized and accessible, inspect served responses. Do not infer production indexing from a local preview.
4. Assess Dutch-language clarity and factual accuracy manually. Identify technical defects separately from editorial suggestions and unverified business details.
5. Report recommended changes and information needed. Implement only with permission, then revalidate the changed tags, references, and visible information.

## Actionable Checklist

- Set the document language to Dutch (`lang="nl"`). Keep the title, meta description, headings, navigation, and informative image text consistently Dutch.
- Provide one descriptive, unique `<title>` reflecting the actual business and service. Avoid duplicated titles, keyword stuffing, and unsupported locality claims.
- Provide one concise, page-specific meta description aligned with visible content. Treat length recommendations as editorial guidance, not a guaranteed snippet length or ranking rule.
- Use a clear primary heading and logical semantic heading structure. Keep important service content in readable, crawlable HTML rather than images or script-only rendering.
- Use descriptive link text and valid destinations. Check fragment IDs and internal image/page paths; do not publish broken links or empty placeholder destinations as functional content.
- Prefer descriptive, factual image filenames when adding approved assets. Before proposing renames, inventory every reference and coordinate updates; preserve approved originals.
- Write meaningful Dutch alt text based on visible content, with empty alt for decorative images. Do not add SEO keywords that reduce accessibility or invent materials, customers, or locations.
- Check the served HTTP status, content type, robots meta tags, and `X-Robots-Tag` where accessible. Inspect existing robots/sitemap configuration if present; their absence alone does not prove a single page cannot be crawled.
- Distinguish intentional preview/staging restrictions from accidental production `noindex` or blocking. Robots exclusions are not an access-control/security mechanism and blocking crawling is not a reliable deindexing instruction.
- Add or revise a canonical URL only after the final production HTTPS URL and preferred host/path are confirmed. Never canonicalize to localhost, a Codespaces URL, a guessed domain, or a placeholder.
- Consider structured data only when business identity, type, URL, contact/location details, and any service area are verified and consistent with visible content. Do not invent required properties to satisfy a validator.
- JSON-LD is a script element: do not add it under the HTML/CSS-only rule without explicit authorization. Report a recommendation or an approved non-script alternative, rather than bypassing that constraint.
- Use local SEO content only for the actual confirmed service area. Do not generate city lists, doorway pages, fake addresses, reviews, ratings, or unsupported business claims.
- Consider sitemap, social metadata, and search-console configuration only when relevant and authorized. Do not add speculative production URLs or imply these guarantee rankings or rich results.

## Validation Methods

### Automated or Tool-Assisted

- Use existing HTML validators/editor diagnostics to check tag structure, duplicate metadata/IDs, and malformed attributes. No dependency installation without permission.
- Inspect actual HTTP responses with an available client for success status, redirects, robots headers, and content type. Check referenced URLs only within the authorized scope.
- If confirmed structured data already exists, validate syntax and vocabulary with an existing tool. Use external validators only with authorization to send the URL/content; syntax validity does not establish factual accuracy or rich-result eligibility.
- Production indexing and search performance require actual confirmed-domain access/data. Mark Search Console, crawler access, and indexing checks **not run** when unavailable; do not infer them from source or localhost.

### Manual Browser Verification

- Inspect the rendered Dutch page, browser title, heading hierarchy, internal navigation, and image descriptions. Confirm metadata reflects the visible offer without false claims.
- Compare every local/business detail and any existing structured data with user-confirmed facts. Escalate contradictions or missing confirmation rather than filling gaps.
- Test desktop and mobile readability and navigation. Distinguish this manual observation from a crawler/indexing result.
- Review canonical/robots behavior in the confirmed deployment environment only when authorized. Record any difference from development preview settings.

## Reporting Format

1. **Scope and evidence:** files/URL/environment, confirmed business facts/domain, and unknowns.
2. **Findings:** priority, linked file/line or response header, evidence, impact, and proposed correction.
3. **Automated results:** exact checks executed, tools, responses, and limitations.
4. **Manual results:** Dutch-language/content review, browser observations, and factual verification; list pending production checks separately.
5. **Approval and changes:** exact modified files if authorized, business confirmations needed, and deferred canonical/structured-data decisions. Do not promise rankings, indexing, or rich results.