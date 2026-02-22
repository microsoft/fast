/**
 * HTML report generator for benchmark results.
 *
 * Assembles a self-contained HTML page by inlining the CSS and JS from
 * adjacent files and embedding per-scenario SVG charts with interactive
 * variant selection.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TraceMetricKey, TraceMetricSeries } from "./trace.ts";
import { TRACE_METRIC_KEYS } from "./trace.ts";
import {
    type ComparisonVariant,
    METRIC_COLORS,
    METRIC_LABELS,
    renderComparisonChart,
    renderSvgChart,
    type SvgChartOptions,
    variantColor,
} from "./chart.ts";

/** Data needed per benchmark for the HTML report. */
export interface ReportBenchmark {
    name: string;
    iterations: TraceMetricSeries;
    stats: Record<
        TraceMetricKey,
        {
            min: number;
            median: number;
            mean: number;
            p95: number;
            max: number;
        }
    >;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Group benchmarks by scenario name (the part before the `/`).
 * Returns an ordered map preserving first-seen order.
 */
function groupByScenario(benchmarks: ReportBenchmark[]): Map<string, ReportBenchmark[]> {
    const groups = new Map<string, ReportBenchmark[]>();
    for (const b of benchmarks) {
        const slashIdx = b.name.indexOf("/");
        const scenario = slashIdx !== -1 ? b.name.slice(0, slashIdx) : b.name;
        let group = groups.get(scenario);
        if (!group) {
            group = [];
            groups.set(scenario, group);
        }
        group.push(b);
    }
    return groups;
}

/** Extract the variant name from a benchmark name (part after `/`). */
function variantName(benchName: string): string {
    const slashIdx = benchName.indexOf("/");
    return slashIdx !== -1 ? benchName.slice(slashIdx + 1) : benchName;
}

function slug(name: string): string {
    return name.replace(/[^a-zA-Z0-9]+/g, "-");
}

// Read static assets once at module load time.
const reportCss = readFileSync(
    resolve(import.meta.dirname, "scenarios", "report.css"),
    "utf-8"
);
const reportJs = readFileSync(
    resolve(import.meta.dirname, "scenarios", "report.js"),
    "utf-8"
);

const STAT_KEYS = ["min", "median", "mean", "p95", "max"] as const;
const STAT_LABELS: Record<(typeof STAT_KEYS)[number], string> = {
    min: "Min",
    median: "Median",
    mean: "Mean",
    p95: "P95",
    max: "Max",
};

/**
 * Build the HTML for a single scenario section: chart, pills, table,
 * and embedded JSON data for the JS controller.
 */
function renderSection(
    scenario: string,
    group: ReportBenchmark[],
    options: SvgChartOptions
): string {
    const id = slug(scenario);

    // Chart SVG
    const compVariants: ComparisonVariant[] = group.map(b => ({
        variant: variantName(b.name),
        series: b.iterations,
    }));
    const svg =
        group.length > 1
            ? renderComparisonChart(scenario, compVariants, options)
            : renderSvgChart(group[0].name, group[0].iterations, options);

    // Variant data blob for the JS controller
    const variantData: Record<string, Record<string, Record<string, number>>> = {};
    for (const b of group) {
        const vn = variantName(b.name);
        variantData[vn] = {};
        for (const key of TRACE_METRIC_KEYS) {
            const s = b.stats[key];
            variantData[vn][key] = {};
            for (const sk of STAT_KEYS) {
                variantData[vn][key][sk] = s[sk];
            }
        }
    }

    // Variant selector pills
    const pills = group
        .map(b => {
            const vn = variantName(b.name);
            const vc = variantColor(vn);
            return (
                `<button class="variant-pill"` +
                ` data-variant="${escapeHtml(vn)}"` +
                ` style="--pill-color:${vc}">` +
                `${escapeHtml(vn)}</button>`
            );
        })
        .join("\n    ");

    // Stats table rows (default: winner view)
    const thCells = STAT_KEYS.map(k => `<th>${STAT_LABELS[k]}</th>`).join("");

    const rows: string[] = [];
    for (const key of TRACE_METRIC_KEYS) {
        const mc = METRIC_COLORS[key];
        const ml = escapeHtml(METRIC_LABELS[key]);
        const cells: string[] = [];
        for (const sk of STAT_KEYS) {
            let bestVal = Infinity;
            let bestVariant = "";
            for (const b of group) {
                const vn = variantName(b.name);
                const val = b.stats[key][sk];
                if (val < bestVal) {
                    bestVal = val;
                    bestVariant = vn;
                }
            }
            const bc = variantColor(bestVariant);
            cells.push(
                `<td data-metric="${key}"` +
                    ` data-stat="${sk}"` +
                    ` style="color:${bc}">` +
                    `${bestVal.toFixed(3)}</td>`
            );
        }
        rows.push(
            `<tr>` +
                `<td class="metric-name"` +
                ` style="color:${mc}">${ml}</td>` +
                cells.join("") +
                `</tr>`
        );
    }

    return `
<section id="${id}" data-scenario="${escapeHtml(id)}">
  <h2><a href="#${id}">${escapeHtml(scenario)}</a></h2>
  <div class="chart">${svg}</div>
  <div class="variant-controls">
    ${pills}
  </div>
  <table class="stats-table">
    <thead>
      <tr><th></th>${thCells}</tr>
    </thead>
    <tbody>${rows.join("\n")}</tbody>
  </table>
  <script type="application/json" class="variant-data">
    ${JSON.stringify(variantData)}
  </script>
</section>`;
}

/**
 * Generate a self-contained HTML report with interactive variant
 * selection. Each scenario section has:
 *   - An overlaid SVG chart with click-to-select variants
 *   - Variant selector pills (radio-style toggle)
 *   - A unified stats table that shows either the "winner" (lowest
 *     value) per cell color-coded by variant, or a single variant's
 *     full numbers when one is selected
 */
export function renderHtmlReport(
    benchmarks: ReportBenchmark[],
    options: SvgChartOptions
): string {
    const groups = groupByScenario(benchmarks);

    const sections: string[] = [];
    for (const [scenario, group] of groups) {
        sections.push(renderSection(scenario, group, options));
    }

    const toc = [...groups.keys()]
        .map(s => {
            const id = slug(s);
            return `<li><a href="#${id}">` + `${escapeHtml(s)}</a></li>`;
        })
        .join("\n");

    const iterCount = benchmarks[0]?.iterations[options.metrics[0]]?.length ?? 0;

    // Config blob consumed by report.js
    const allVariants: Record<string, string> = {};
    for (const [, group] of groups) {
        for (const b of group) {
            const vn = variantName(b.name);
            allVariants[vn] = variantColor(vn);
        }
    }
    const reportConfig = JSON.stringify({
        colors: allVariants,
        metrics: TRACE_METRIC_KEYS,
        stats: STAT_KEYS,
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Benchmark Results</title>
<style>
${reportCss}
</style>
</head>
<body>
<div class="layout">
  <nav>
    <h1>Benchmarks</h1>
    <ul>${toc}</ul>
  </nav>
  <main>
    <p class="meta">${benchmarks.length} benchmark(s) \
&middot; ${groups.size} scenario(s) \
&middot; ${iterCount} iterations \
&middot; ${new Date().toLocaleString()}</p>
${sections.join("\n")}
  </main>
</div>
<script id="report-config" type="application/json">
${reportConfig}
</script>
<script>
${reportJs}
</script>
</body>
</html>`;
}
