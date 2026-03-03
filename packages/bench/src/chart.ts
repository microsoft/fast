/**
 * SVG chart generator for benchmark iteration data.
 * Produces a small-multiples layout: one panel per metric, stacked vertically,
 * sharing the x-axis (iteration number).
 *
 * Also supports a comparison layout that overlays multiple variant lines on
 * the same panel per metric, with hover-to-emphasize interaction.
 */
import type { TraceMetricKey, TraceMetricSeries } from "./trace.ts";

export interface SvgChartOptions {
    /** Which metrics to include as panels. */
    metrics: TraceMetricKey[];
    /** SVG width in pixels. Default: 720. */
    width?: number;
}

export const METRIC_LABELS: Record<TraceMetricKey, string> = {
    scripting: "Scripting",
    layout: "Layout",
    styleRecalc: "Style Recalc",
    paint: "Paint",
    total: "Total (trace)",
    userMeasure: "User Measure",
    fcp: "FCP",
    lcp: "LCP",
    dcl: "DCL",
};

export const METRIC_COLORS: Record<TraceMetricKey, string> = {
    scripting: "#4285f4",
    layout: "#ea4335",
    styleRecalc: "#f59e0b",
    paint: "#34a853",
    total: "#8b5cf6",
    userMeasure: "#f97316",
    fcp: "#14b8a6",
    lcp: "#ec4899",
    dcl: "#0ea5e9",
};

export function escapeXml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Format a number for axis labels. */
function fmt(v: number): string {
    if (Math.abs(v) >= 10) return v.toFixed(1);
    if (Math.abs(v) >= 1) return v.toFixed(2);
    return v.toFixed(3);
}

/**
 * A palette of visually distinct colors assigned to variants by
 * insertion order. Colors are chosen to maximize contrast between
 * adjacent entries so that the first two variants in any scenario
 * are always easy to distinguish.
 */
const VARIANT_PALETTE = [
    "#6366f1", // indigo
    "#f59e0b", // amber
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f97316", // orange
    "#14b8a6", // teal
    "#ef4444", // red
    "#3b82f6", // blue
];

let variantColorIndex = 0;
const variantColorCache = new Map<string, string>();

export function variantColor(variant: string): string {
    let color = variantColorCache.get(variant);
    if (!color) {
        color = VARIANT_PALETTE[variantColorIndex++ % VARIANT_PALETTE.length];
        variantColorCache.set(variant, color);
    }
    return color;
}

/** A single variant's data for a comparison chart. */
export interface ComparisonVariant {
    /** Short variant label, e.g. "fe", "fhtml". */
    variant: string;
    series: TraceMetricSeries;
}

/**
 * Generate an SVG chart with small-multiple panels for a single benchmark.
 * Returns a complete SVG document string.
 */
export function renderSvgChart(
    name: string,
    series: TraceMetricSeries,
    options: SvgChartOptions
): string {
    const metrics = options.metrics;
    const width = options.width ?? 720;

    const margin = { top: 48, right: 32, bottom: 16, left: 72 };
    const plotWidth = width - margin.left - margin.right;
    const panelHeight = 80;
    const panelGap = 44;
    const totalPanelsHeight = metrics.length * (panelHeight + panelGap) - panelGap;
    const height = margin.top + totalPanelsHeight + margin.bottom;

    const parts: string[] = [];

    const vb0 = `0 0 ${width} ${height}`;
    const ff0 = "system-ui, -apple-system, sans-serif";
    parts.push(
        `<svg xmlns="http://www.w3.org/2000/svg"` +
            ` viewBox="${vb0}" width="${width}"` +
            ` height="${height}" font-family="${ff0}">`
    );

    // Background
    parts.push(`<rect width="${width}" height="${height}" fill="var(--bg)"/>`);

    // Title
    parts.push(
        `<text x="${
            width / 2
        }" y="28" text-anchor="middle" font-size="15" font-weight="600" fill="var(--fg)">${escapeXml(
            name
        )} (ms)</text>`
    );

    // Render each metric panel
    for (let mi = 0; mi < metrics.length; mi++) {
        const metric = metrics[mi];
        const data = series[metric];
        const color = METRIC_COLORS[metric];
        const label = METRIC_LABELS[metric];
        const panelY = margin.top + mi * (panelHeight + panelGap);
        // Data range
        let dMin = Infinity;
        let dMax = -Infinity;
        let sum = 0;
        for (const v of data) {
            if (v < dMin) dMin = v;
            if (v > dMax) dMax = v;
            sum += v;
        }
        const mean = sum / data.length;

        if (dMax === dMin) {
            const pad = Math.max(Math.abs(dMin) * 0.1, 0.5);
            dMin -= pad;
            dMax += pad;
        }

        // Add 5% vertical padding
        const range = dMax - dMin;
        dMin -= range * 0.05;
        dMax += range * 0.05;
        const yRange = dMax - dMin;

        const toX = (i: number) =>
            margin.left +
            (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2);
        const toY = (v: number) =>
            panelY + panelHeight - ((v - dMin) / yRange) * panelHeight;

        parts.push(`<g>`);

        // Panel background
        parts.push(
            `<rect x="${margin.left}" y="${panelY}" width="${plotWidth}" height="${panelHeight}" fill="var(--surface)" rx="3"/>`
        );

        // Horizontal grid lines (4 evenly spaced)
        const gridCount = 4;
        for (let g = 0; g <= gridCount; g++) {
            const tick = dMin + range * 0.05 + (g / gridCount) * range * 0.9;
            const y = toY(tick);
            parts.push(
                `<line x1="${margin.left}" y1="${y}" x2="${
                    margin.left + plotWidth
                }" y2="${y}" stroke="var(--border)" stroke-width="0.5"/>`
            );
            parts.push(
                `<text x="${margin.left - 8}" y="${
                    y + 3.5
                }" text-anchor="end" font-size="9" fill="var(--muted)">${fmt(
                    tick
                )}</text>`
            );
        }

        // Line
        const linePoints: string[] = [];
        for (let i = 0; i < data.length; i++) {
            linePoints.push(`${toX(i)},${toY(data[i])}`);
        }
        parts.push(
            `<polyline points="${linePoints.join(" ")}"` +
                ` fill="none" stroke="${color}"` +
                ` stroke-width="1.5"` +
                ` stroke-linejoin="round"` +
                ` stroke-linecap="round"/>`
        );

        // Mean reference line (dashed)
        const meanY = toY(mean);
        const meanX2 = margin.left + plotWidth;
        parts.push(
            `<line x1="${margin.left}" y1="${meanY}"` +
                ` x2="${meanX2}" y2="${meanY}"` +
                ` stroke="${color}" stroke-width="1"` +
                ` stroke-dasharray="4 3" opacity="0.4"/>`
        );
        parts.push(
            `<text x="${meanX2 + 4}" y="${meanY + 3}"` +
                ` font-size="8" fill="${color}"` +
                ` opacity="0.7">avg ${fmt(mean)}</text>`
        );

        // Data point dots (skip if too dense)
        if (data.length <= 60) {
            for (let i = 0; i < data.length; i++) {
                parts.push(
                    `<circle cx="${toX(i)}" cy="${toY(
                        data[i]
                    )}" r="2" fill="${color}" opacity="0.6"/>`
                );
            }
        }

        // Metric label
        parts.push(
            `<text x="${margin.left + 6}" y="${
                panelY - 6
            }" font-size="11" font-weight="500" fill="${color}">${escapeXml(
                label
            )}</text>`
        );

        // Per-panel X-axis
        const xAxisY = panelY + panelHeight + 2;
        const xTickCount = Math.min(Math.max(data.length, 2), 10);
        for (let t = 0; t < xTickCount; t++) {
            const dataIdx = Math.round((t * (data.length - 1)) / (xTickCount - 1));
            const x = toX(dataIdx);
            const iterNum = dataIdx + 1;
            // Vertical grid line inside panel
            parts.push(
                `<line x1="${x}" y1="${panelY}" x2="${x}" y2="${
                    panelY + panelHeight
                }" stroke="var(--border)" stroke-width="0.5"/>`
            );
            parts.push(
                `<line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${
                    xAxisY + 4
                }" stroke="var(--muted)" stroke-width="1"/>`
            );
            parts.push(
                `<text x="${x}" y="${
                    xAxisY + 14
                }" text-anchor="middle" font-size="8" fill="var(--muted)">${iterNum}</text>`
            );
        }

        parts.push(`</g>`);
    }

    parts.push(`</svg>`);

    return parts.join("\n");
}

/**
 * Render a comparison SVG chart for a single scenario showing all variant
 * lines overlaid on the same panel per metric. Each variant gets its own
 * color. The SVG includes CSS hover rules so mousing over a variant's
 * line emphasizes it (and its lines across all metric panels) while
 * dimming the others.
 */
export function renderComparisonChart(
    scenario: string,
    variants: ComparisonVariant[],
    options: SvgChartOptions
): string {
    const metrics = options.metrics;
    const width = options.width ?? 720;

    const margin = { top: 48, right: 104, bottom: 16, left: 72 };
    const plotWidth = width - margin.left - margin.right;
    const panelHeight = 100;
    const panelGap = 48;
    const legendHeight = 28;
    const totalPanelsHeight = metrics.length * (panelHeight + panelGap) - panelGap;
    const height = margin.top + legendHeight + totalPanelsHeight + margin.bottom;

    const parts: string[] = [];

    const vb = `0 0 ${width} ${height}`;
    const ff = "system-ui, -apple-system, sans-serif";
    parts.push(
        `<svg xmlns="http://www.w3.org/2000/svg"` +
            ` viewBox="${vb}" width="${width}"` +
            ` height="${height}" font-family="${ff}">`
    );

    // Hover + selection styles for variant groups
    parts.push(`<style>`);
    parts.push(`  .variant-group {` + ` transition: opacity 0.15s; cursor: pointer; }`);
    // Hover: dim non-hovered when no selection is active
    parts.push(
        `  .comp-chart:not(.has-selection)` +
            `:has(.variant-group:hover)` +
            ` .variant-group:not(:hover)` +
            ` { opacity: 0.12; }`
    );
    // Selection: dim non-selected variants
    parts.push(
        `  .comp-chart.has-selection` +
            ` .variant-group:not(.selected)` +
            ` { opacity: 0.12; }`
    );
    parts.push(`</style>`);

    // Wrapper group for hover scoping
    parts.push(`<g class="comp-chart">`);

    // Background
    parts.push(`<rect width="${width}" height="${height}" fill="var(--bg)"/>`);

    // Title
    parts.push(
        `<text x="${width / 2}" y="28"` +
            ` text-anchor="middle" font-size="15"` +
            ` font-weight="600"` +
            ` fill="var(--fg)">${escapeXml(scenario)} (ms)</text>`
    );

    // Legend row (rendered inside variant groups below for hover)
    const contentTop = margin.top + legendHeight;

    // Pre-compute shared Y ranges for each metric
    const metricRanges = metrics.map(metric => {
        let dMin = Infinity;
        let dMax = -Infinity;
        for (const v of variants) {
            for (const val of v.series[metric]) {
                if (val < dMin) dMin = val;
                if (val > dMax) dMax = val;
            }
        }
        if (dMax === dMin) {
            const pad = Math.max(Math.abs(dMin) * 0.1, 0.5);
            dMin -= pad;
            dMax += pad;
        }
        const range = dMax - dMin;
        dMin -= range * 0.05;
        dMax += range * 0.05;
        return { dMin, dMax, range, yRange: dMax - dMin };
    });

    // --- Pass 1: Render panel backgrounds, grids, and labels ---
    for (let mi = 0; mi < metrics.length; mi++) {
        const metric = metrics[mi];
        const metricColor = METRIC_COLORS[metric];
        const label = METRIC_LABELS[metric];
        const panelY = contentTop + mi * (panelHeight + panelGap);
        const { dMin, range, yRange } = metricRanges[mi];

        const toY = (v: number) =>
            panelY + panelHeight - ((v - dMin) / yRange) * panelHeight;

        // Panel background
        parts.push(
            `<rect x="${margin.left}" y="${panelY}"` +
                ` width="${plotWidth}"` +
                ` height="${panelHeight}"` +
                ` fill="var(--surface)" rx="3"/>`
        );

        // Grid lines
        const gridCount = 4;
        for (let g = 0; g <= gridCount; g++) {
            const tick = dMin + range * 0.05 + (g / gridCount) * range * 0.9;
            const y = toY(tick);
            parts.push(
                `<line x1="${margin.left}" y1="${y}"` +
                    ` x2="${margin.left + plotWidth}" y2="${y}"` +
                    ` stroke="var(--border)" stroke-width="0.5"/>`
            );
            parts.push(
                `<text x="${margin.left - 8}" y="${y + 3.5}"` +
                    ` text-anchor="end" font-size="9"` +
                    ` fill="var(--muted)">${fmt(tick)}</text>`
            );
        }

        // Metric label
        parts.push(
            `<text x="${margin.left + 6}" y="${panelY - 6}"` +
                ` font-size="11" font-weight="500"` +
                ` fill="${metricColor}">` +
                `${escapeXml(label)}</text>`
        );
        // Per-panel X-axis
        const sampleData = variants[0].series[metric];
        const xAxisY = panelY + panelHeight + 2;
        const xTickCount = Math.min(Math.max(sampleData.length, 2), 10);
        for (let t = 0; t < xTickCount; t++) {
            const dataIdx = Math.round((t * (sampleData.length - 1)) / (xTickCount - 1));
            const x =
                margin.left +
                (sampleData.length > 1
                    ? (dataIdx / (sampleData.length - 1)) * plotWidth
                    : plotWidth / 2);
            const iterNum = dataIdx + 1;
            // Vertical grid line inside panel
            parts.push(
                `<line x1="${x}" y1="${panelY}"` +
                    ` x2="${x}" y2="${panelY + panelHeight}"` +
                    ` stroke="var(--border)" stroke-width="0.5"/>`
            );
            parts.push(
                `<line x1="${x}" y1="${xAxisY}"` +
                    ` x2="${x}" y2="${xAxisY + 4}"` +
                    ` stroke="var(--muted)" stroke-width="1"/>`
            );
            parts.push(
                `<text x="${x}" y="${xAxisY + 14}"` +
                    ` text-anchor="middle" font-size="8"` +
                    ` fill="var(--muted)">${iterNum}</text>`
            );
        }
    }

    // --- Pass 2: Render each variant as a single <g> across
    //     ALL metric panels so hover highlights the whole variant ---
    const legendY = margin.top + 4;
    const legendItemWidth = plotWidth / variants.length;

    for (let ci = 0; ci < variants.length; ci++) {
        const v = variants[ci];
        const vc = variantColor(v.variant);

        parts.push(
            `<g class="variant-group"` + ` data-variant="${escapeXml(v.variant)}">`
        );

        // Legend swatch + label (part of the variant group)
        const lx = margin.left + ci * legendItemWidth + legendItemWidth / 2;
        parts.push(
            `<rect x="${lx - 26}" y="${legendY - 6}"` +
                ` width="12" height="4" rx="2"` +
                ` fill="${vc}"/>`
        );
        parts.push(
            `<text x="${lx - 10}" y="${legendY}"` +
                ` font-size="11" font-weight="500"` +
                ` fill="${vc}">${escapeXml(v.variant)}</text>`
        );

        // Render this variant's data across all metric panels
        for (let mi = 0; mi < metrics.length; mi++) {
            const metric = metrics[mi];
            const data = v.series[metric];
            const panelY = contentTop + mi * (panelHeight + panelGap);
            const { dMin, yRange } = metricRanges[mi];

            const toY = (val: number) =>
                panelY + panelHeight - ((val - dMin) / yRange) * panelHeight;
            const toX = (i: number) =>
                margin.left +
                (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2);

            // Line
            const linePoints: string[] = [];
            for (let i = 0; i < data.length; i++) {
                linePoints.push(`${toX(i)},${toY(data[i])}`);
            }
            parts.push(
                `<polyline points="${linePoints.join(" ")}"` +
                    ` fill="none" stroke="${vc}"` +
                    ` stroke-width="1.5"` +
                    ` stroke-linejoin="round"` +
                    ` stroke-linecap="round"/>`
            );

            // Mean reference line
            let sum = 0;
            for (const val of data) sum += val;
            const mean = sum / data.length;
            const meanY = toY(mean);
            const meanX2 = margin.left + plotWidth;
            parts.push(
                `<line x1="${margin.left}" y1="${meanY}"` +
                    ` x2="${meanX2}" y2="${meanY}"` +
                    ` stroke="${vc}" stroke-width="1"` +
                    ` stroke-dasharray="4 3" opacity="0.35"/>`
            );

            // Mean label — stagger vertically by variant index
            const meanLabelY = meanY - 4 + ci * 10;
            parts.push(
                `<text x="${meanX2 + 4}"` +
                    ` y="${meanLabelY}"` +
                    ` font-size="8" fill="${vc}"` +
                    ` opacity="0.8">` +
                    `${escapeXml(v.variant)} ${fmt(mean)}</text>`
            );

            // Invisible wide hover target over the line
            parts.push(
                `<polyline points="${linePoints.join(" ")}"` +
                    ` fill="none" stroke="transparent"` +
                    ` stroke-width="12"/>`
            );
        }

        parts.push(`</g>`);
    }

    // Close wrapper group
    parts.push(`</g>`);

    parts.push(`</svg>`);

    return parts.join("\n");
}
