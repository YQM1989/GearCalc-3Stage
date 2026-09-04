# GearCalc-3Stage Design QA

- Source visual truth: the industrial engineering mockup approved in the design-review task (kept outside the repository).
- Implementation: `http://127.0.0.1:5173/`
- Implementation screenshot: Codex in-app browser capture retained inline in the task; the browser surface did not expose a filesystem save path.
- Comparison surface: temporary side-by-side browser page, removed after QA.
- Source pixels: 1488 × 1058.
- Implementation CSS viewport: 1488 × 1058 inside a same-origin iframe.
- Density normalization: both surfaces displayed at the same 0.407 scale in one 1280 × 720 browser capture.
- State: built-in three-stage example, light theme, first-stage detail selected for the full-view comparison.

## Findings

No actionable P0, P1, or P2 differences remain in the agreed first-version scope.

- [P3] Header actions are intentionally reduced.
  - Location: top toolbar.
  - Evidence: the visual target includes new/open/save/export/help; the implementation keeps the established working actions plus three non-interactive context labels.
  - Impact: lower mock fidelity, but no false file workflow or broken core calculation path was introduced.
  - Follow-up: add these workflows only when their behavior and persistence model are defined.

- [P3] Tooth flank outlines are engineering-display profiles, not manufacturing geometry.
  - Location: transmission overview and mesh detail.
  - Evidence: tooth count, pitch-circle tangency, pair scale, equal circular pitch, pitch point and 20° line of action are parameter-driven; the visible tooth flank is simplified rather than a tolerance-ready involute.
  - Impact: suitable for scheme comparison and UI explanation, not for exporting a manufacturing profile.
  - Follow-up: introduce an exact involute generator only if CAD/export becomes an accepted product goal.

## Required Fidelity Surfaces

- Fonts and typography: system Chinese UI stack retained; title, pane headings, numerical results, technical labels and table text match the source hierarchy without clipping at 1488 × 1058.
- Spacing and layout rhythm: header, left input pane, central engineering view, right results/risk pane and bottom tables match the source composition. Responsive clamp tracks keep the center usable at 1280 px while restoring source-like pane proportions at 1488 px.
- Colors and visual tokens: white and cool-gray surfaces, graphite linework, blue selection, muted teal drivers, oxidized amber driven gears, red contact geometry and amber/red risk semantics match the selected direction.
- Image and diagram fidelity: the central diagram is intentionally a live parameterized SVG rather than a raster copy. Every active pair shows its input tooth count, pitch-circle tangency and contact point; the detail view updates with the selected stage module.
- Copy and content: Chinese labels, real example values, units, ratios, speeds, torque, efficiency, center distance, risks and title-block date are present and consistent with the calculation result.

## Interaction Evidence

- `载入示例` changed the page from one stage to the agreed 11/69, 36/57, 16/96 three-stage example.
- Selecting the second gear pair changed the lower detail title to `第 2 级` and displayed `p = πm = 1.885 mm`.
- Changing second-stage module from 0.6 to 0.8 updated center distance from 27.90 to 37.20 mm, both gear dimensions, and both detail pitch labels to 2.513 mm; the example was restored afterward.
- Browser console errors and warnings: none.

## Comparison History

1. First browser pass at 1280 × 720 found a P2 center-width mismatch and an undersized gear overview caused by fixed 350/274 px side panes.
2. Fixed the layout with responsive `clamp()` side tracks and reduced the bottom table height on shorter screens.
3. The first same-size 1488 × 1058 comparison found the gear silhouettes about 15–20% smaller than the visual target.
4. Increased the stage tooth-pitch display scale and maximum driven-gear radius while retaining pitch-circle tangency and the pair's tooth-count relationship.
5. Final same-size comparison confirmed the major region proportions, gear prominence, three contact points, detail panel and bottom-table start line now align with the first-version target.

## Implementation Checklist

- [x] Preserve calculation and validation behavior.
- [x] Implement the industrial three-pane and bottom-table layout.
- [x] Draw tooth-count-sensitive gear pairs from current inputs.
- [x] Show same-module labels, pitch circles, pitch point P and 20° line of action.
- [x] Make the selected-stage mesh detail interactive and parameter-driven.
- [x] Verify tests, production build, browser interactions and browser console.

## Follow-up Polish

- Consider a user-controlled `工程示意 / 齿形精确` display mode before adding manufacturing-grade involute geometry.
- Define file persistence and export requirements before turning the header labels into controls.

final result: passed
