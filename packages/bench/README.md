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

From this folder (`packages/bench`):

```bash
npm run bench
```

This will:

1. Build the scenarios with Vite (into `server/dist`)
2. Start the static server on `http://localhost:5174`
3. Run all discovered scenarios through Playwright
4. Print stats tables to the console
5. Generate an interactive HTML report at `results/index.html`

### Iteration count

Default is 50 iterations per benchmark. Override with `BENCH_ITERATIONS`:

```bash
BENCH_ITERATIONS=100 npm run bench
```

### Running specific scenarios

Pass scenario names as arguments to filter which benchmarks run:

```bash
npm run bench -- basic bind-text
```

Each argument is matched as a substring, so `basic` runs `basic/fe`, `basic/fhtml`, and `basic/fhtml-hydrate`. You can also target a specific variant:

```bash
npm run bench -- basic/fe
```

## Running from repo root

```bash
npm run bench -w @microsoft/fast-bench
```

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
    bind-attr/
    ...
```

## Output

The report at `results/index.html` includes:

- **Overlaid line charts** per scenario with all variants (fe, fhtml, fhtml-hydrate) on shared axes
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

All values are in milliseconds.

## Dev server

For iterating on scenarios without running the full benchmark:

```bash
npm run serve
```

This starts Vite on `http://localhost:5173` with hot reload.
