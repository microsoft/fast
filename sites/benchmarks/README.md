# Benchmarking FAST templates and rendering scenarios

This package benchmarks FAST Element and FAST HTML rendering scenarios. It uses Playwright to automate Chrome, collects CDP trace data, computes timing statistics, and generates an interactive HTML report.

## Prerequisites

- Node.js `>=22.12.0`
- npm `>=10`
- Dependencies installed from repo root:

```bash
npm install
```

## Running benchmarks

From this folder (`sites/benchmarks`):

```bash
npm run bench
```

This will:

1. Build the scenarios with Vite (into `server/dist`)
2. Start the static server on `http://localhost:5174`
3. Run all discovered scenarios through Playwright
4. Print stats tables to the console
5. Generate an interactive HTML report at `results/latest.html`

### Iteration count

Default is 50 iterations per benchmark. Override with `BENCH_ITERATIONS`:

```bash
BENCH_ITERATIONS=100 npm run bench
```

### Running specific scenarios

Pass scenario names as arguments to filter which benchmarks run:

```bash
npm run bench -- basic attr-reflect
```

Each argument is matched as a substring, so `basic` runs `basic/csr` and `basic/hydration`. You can also target a specific variant:

```bash
npm run bench -- basic/csr
```

## Running from repo root

```bash
npm run bench -w @microsoft/fast-bench
```

## Repeat mutation workloads

Run the mutation workloads from the repository root:

```bash
BENCH_ITERATIONS=20 npm run bench -w @microsoft/fast-bench -- repeat-mutations
```

The mutation workloads share one driver. Rendered variants use the same component,
row markup, and initial items for CSR and SSR:

| Variant | Workload | SSR variant |
| --- | --- | --- |
| `array-sort` | Sort 10,000 duplicate-heavy values without rendering | None |
| `array-splices` | Normalize full-array replacements with overlapping values | None |
| `sort` | Alternate ascending and descending rendered-list order | `sort-ssr` |
| `reverse` | Reverse a rendered list | `reverse-ssr` |
| `prepend` | Prepend 128 items per delivery | `prepend-ssr` |
| `mixed` | Deliver sort, append, and reverse mutations in the same batch | `mixed-ssr` |

Run a CSR/SSR pair by filtering on the workload name. This command runs both
`sort` and `sort-ssr`:

```bash
BENCH_ITERATIONS=20 npm run bench -w @microsoft/fast-bench -- repeat-mutations/sort
```

SSR pages start with 2,000 server-rendered items and verify that hydration keeps
every existing item node. The mutation clock starts after hydration. Each mutation
page performs eight deliveries, checks the first item after each delivery, and
verifies the full final order before signaling completion.

SSR uses the standard `hydration/entry.html`, `hydration/state.json`, and
`template.html` fixtures with the shared scenario loader and render cache.
The `<!-- @bench-ssr-render 1 -->` marker renders one component containing the
2,000 items. Keep the state fixture in sync with `createMutationItems()` when
changing the initial items.

The `bench` user measure includes mutation processing, reactive updates, and the
per-delivery check. It excludes initial mounting or hydration and the final full
assertion. Rendered variants await the update queue; observer-only variants flush
directly. Compare results from the same benchmark setup, browser, and machine.
FCP and LCP describe the initial page paint, not the mutation interval.

To measure initial hydration separately, run:

```bash
BENCH_ITERATIONS=20 npm run bench -w @microsoft/fast-bench -- repeat-mutations/hydration
```

This page times custom-element registration and hydration of the same 2,000-item
list without mutations. Its node-reuse assertion runs after the measured interval.
Server rendering happens during the Vite build and is excluded from browser
timings. Timing results are informational rather than correctness-test thresholds.

## Project structure

```text
src/
  bench.ts        Runner orchestrator (Playwright + CDP)
  chart.ts        SVG chart rendering
  report.ts       HTML report assembly
  trace.ts        CDP trace event parsing + stats
  scenarios/
    harness.ts    Shared benchmark runtime
    tree.ts       Tree data generator for scenarios
    report.css    Report styles (inlined into output)
    report.js     Report interaction (inlined into output)
    index.html    Dev server landing page
    basic/        Scenario directories...
    attr-reflect/
    bind-event/
    dot-syntax/
    ref-slotted/
    repeat/
    repeat-mutations/
    when/
```

The mounting and hydration scenarios use this structure:

```text
<scenario>/
  element.ts        Shared element class definition
  template.html     <f-template> for hydration variants
  csr/
    index.html      Client-side rendering entry
    main.ts         CSR variant script
  hydration/
    index.html      SSR + hydration entry (uses <!-- @bench-ssr-render -->)
    main.ts         Hydration variant script
    render.ts       SSR HTML generator for Vite build-time rendering
```

## Output

The report at `results/latest.html` (symlinked to the most recent timestamped run) includes:

- **Overlaid line charts** per scenario with all variants (csr, hydration) on shared axes
- **Hover-to-emphasize** and **click-to-select** variant interaction
- **Winner table** showing the best value per metric/stat, color-coded by variant
- **Variant drill-down** — click a variant to see its full stats

Metrics collected per iteration:

| Metric | Description |
| --- | --- |
| Scripting | JS execution (EvaluateScript, FunctionCall, etc.) |
| Layout | Layout computation |
| Style Recalc | Style recalculation |
| Paint | Paint, compositing, layerization |
| Total (trace) | Sum of the above four |
| User Measure | Duration of the `bench` performance.measure |
| FCP | First Contentful Paint (relative to navigation start) |
| LCP | Largest Contentful Paint (relative to navigation start) |
| DCL | DOMContentLoaded (relative to navigation start) |

Summary statistics: Min, Median, Mean, Geometric Mean, P95, Max. All values are in milliseconds.

## Dev server

For iterating on scenarios without running the full benchmark:

```bash
npm run serve
```

This starts Vite on `http://localhost:5173` with hot reload.
