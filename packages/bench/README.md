# Benchmarking FAST templates and rendering scenarios

This package provides a framework for running benchmarks against FAST templates and rendering scenarios. It uses Playwright to automate Chrome and collect performance data, which is then printed in a readable format.

## What this package does

- Discovers benchmark suites from `src/*/` directories.
- Runs each benchmark serially with Playwright (`src/bench.spec.ts`).
- Collects Chrome trace data and prints timing stats (min/median/mean/p95/max).

## Prerequisites

- Node.js `>=22.12.0`
- npm `>=10`
- Dependencies installed from repo root:

```bash
npm install
```

## Local workflows

### 1) Run benchmarks against the Vite dev server (default)

From this folder (`packages/bench`):

```bash
npm run bench
```

This uses:

- `npm run serve` (Vite on `http://localhost:5173`)
- Playwright test file: `src/bench.spec.ts`
- Desktop Chrome with `headless: false`

### 2) Run benchmarks against the built `dist` output

Build once, then run tests with `BENCH_DIST=true`:

```bash
npm run build # builds Vite output to `server/dist`
BENCH_DIST=true npm run bench
```

This uses:

- `npm start` (static server from `server/dist` on `http://localhost:5174`)
- The same Playwright benchmark suite

## Controlling benchmark runs

### Iteration count

Default iterations per benchmark are `10`.

Override with `BENCH_ITERATIONS`:

```bash
BENCH_ITERATIONS=50 npm run bench
```

You can combine with dist mode:

```bash
BENCH_DIST=true BENCH_ITERATIONS=50 npm run bench
```

## Running from repo root

You can run workspace scripts without changing directories:

```bash
npm run bench -w @microsoft/fast-bench
npm run build -w @microsoft/fast-bench
BENCH_DIST=true npm run bench -w @microsoft/fast-bench
```

## Output

After all suites finish, results are printed in grouped tables per benchmark:

- Scripting
- Layout
- Style Recalc
- Paint
- Total (trace)
- User Measure

All values are in milliseconds.

## Server implementation

The `server/` folder contains a simple Node.js HTTP server that serves static files from `server/dist`. After building the Vite output, this server is used to run benchmarks against the production build. The entire server directory can then be used to host the built output, and the server will serve files from the `dist` subfolder.
