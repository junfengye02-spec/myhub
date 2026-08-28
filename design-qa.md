# Design QA — Yven Portfolio v2

## Evidence

- Source visual truth: `/Users/jf/.codex/generated_images/01a03d42-e710-7300-97b6-ed338315c334/exec-b7e9398a-9106-43ce-90ae-8c0723c75a9e.png`
- Source pixels: `862 × 1824`, 1× raster reference.
- Browser-rendered implementation: `http://10.56.191.98:4321/`
- Desktop captures: `tmp/design-qa-v2/hero-desktop.png`, `experience.png`, `review-exact.png`, `quant-evidence.png`, `job-exact.png`, `api-desktop.png`, `mise-desktop.png`
- Desktop capture size: `1440 × 1000` at a `1440 × 1000` CSS viewport, DPR normalized to 1.
- Mobile captures: `tmp/design-qa-v2/mobile-hero-final.png`, `mobile-review.png`, `mobile-quant.png`, `mobile-job.png`
- Mobile capture size: `390 × 844` at a `390 × 844` CSS viewport, DPR normalized to 1.
- Full comparison input: `tmp/design-qa-v2/comparison-board.jpg`
- Focused post-fix comparison input: `tmp/design-qa-v2/mobile-comparison-postfix.jpg`
- Mise Studio source captures: `public/project-shots/mise-studio-projects.png`, `mise-studio-storyboard.png`, `mise-studio-idea.png`, `mise-studio-settings.png`, `mise-studio-resources.png`
- Mise Studio implementation captures: `tmp/portfolio-mise-desktop.png`, `tmp/portfolio-mise-evidence-desktop.png`, `tmp/portfolio-mise-mobile-stage.png`, `tmp/portfolio-mise-mobile-evidence.png`
- Mise Studio combined comparison input: `tmp/design-qa-mise-comparison.png`
- State: light theme, motion enabled, anonymous public portfolio.

## Full-view comparison evidence

The combined board places the approved quiet-luxury reference and seven browser-rendered implementation regions in the same image. The implementation preserves the intended ivory paper, ink-black editorial type, bottle green, oxblood, brass accents, outlined chapter numerals, restrained hairlines and real project UI. The page is intentionally more expanded than the original single-sheet mock because the user requested richer experience evidence, six complete project cases, and deeper Quant/Review technical content.

## Focused-region evidence

- Hero: the implementation keeps the reference hierarchy and palette while replacing the static orbit treatment with a real Three.js paper surface, brass nodes and particle route.
- Experience: dossier sheets strengthen paper depth and place verified delivery evidence above the project chapters.
- ReviewChecklist: the previous frontend screenshot is removed; a readable, semantic five-stage evidence/recovery pipeline replaces it.
- QuantClaw: the five-layer architecture, account snapshot, factor-level evidence and risk limits remain visually distinct and readable.
- Mobile: ReviewChecklist and QuantClaw switch from horizontal tracks to vertical reading order; the Job Skill title and workflow wrap without clipping.
- Image quality: APS/MES, Yven API, Mise Studio and the user-provided Quant account capture retain their real source ratios and remain sharp in their frames.

## Required fidelity surfaces

- Fonts and typography: Iowan Old Style / Songti display treatment, Avenir/PingFang body text, chapter scales and optical contrast match the reference direction. Long English product names wrap deliberately on mobile.
- Spacing and layout rhythm: generous editorial whitespace is preserved; paper dossiers, chapter headers and evidence panels have consistent hairlines, shadows and section cadence.
- Colors and tokens: ivory, paper-deep, bottle green, oxblood and brass tokens stay consistent across all six cases; dark Quant surfaces meet readable foreground contrast.
- Image quality and asset fidelity: only real project captures are used as product imagery. Technical flows are semantic information diagrams, not fake product screenshots.
- Copy and content: project names, domains, metrics, attribution boundaries and research caveats match the supplied resume/project evidence.
- Accessibility and behavior: semantic headings/landmarks, alt text, visible focus styles, reduced-motion handling, ≥42px mobile navigation targets and a motion toggle are present.

## Comparison history

### Iteration 1

- [P2] Mobile hero split the phrase “复杂业务” between characters at `390px`, weakening the key message.
- Fix: added `white-space: nowrap` to `.hero-statement em` in `src/styles/global.css`.
- Post-fix evidence: `tmp/design-qa-v2/mobile-hero-final.png` and `tmp/design-qa-v2/mobile-comparison-postfix.jpg`; the phrase now stays intact and the statement remains within the viewport.

### Iteration 2

- Rechecked desktop and `390px` mobile hero, ReviewChecklist, QuantClaw and Adaptive Interview Coach.
- No actionable P0/P1/P2 differences remain.

### Iteration 3 — Mise Studio source correction

- Replaced the previous OpenMontage-like editor image with the authenticated production entry at `video.0000238.xyz` and its real structured storyboard workbench.
- Added three read-only product-depth captures: inspiration conversation + live Creative Brief, approved world/continuity settings, and the project resource library.
- Every public capture excludes the global account header; no email, wallet balance, password or credential is visible.
- Desktop initially placed the three supporting workspaces in separate implicit grid rows, making the chapter unnecessarily tall. The contact sheet was corrected to one staggered 3-column editorial row; the chapter height dropped from roughly 4001px to 2891px without sacrificing legibility.
- Rechecked `1440 × 900` and `390 × 844`: all five real UI images load at their natural resolution, there is no horizontal overflow, the paper layers stack correctly, and mobile preserves a clear linear reading order.
- No actionable P0/P1/P2 differences remain.

## Interactions and runtime checks

- Tested anchor navigation to experience, projects and all six project chapters.
- Tested desktop and mobile responsive states, hover/tilt-ready surfaces, reduced-density 3D scene behavior and fixed navigation.
- Browser console checked after desktop and mobile navigation: no errors or warnings.
- `npm run build` passes and generates all eight static routes.
- Mise Studio source exploration was read-only: no image/video generation action, upload, payment, save or destructive operation was triggered.

## Follow-up polish

- P3: external Quant factor site was not visually captured because the domain timed out from this environment; homepage statistics were instead grounded in the locally audited QuantClaw records and linked to the live domain.

final result: passed
