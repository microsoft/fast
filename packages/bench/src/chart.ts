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
};

export const METRIC_COLORS: Record<TraceMetricKey, string> = {
    scripting: "#4285f4",
    layout: "#ea4335",
    styleRecalc: "#f59e0b",
    paint: "#34a853",
    total: "#8b5cf6",
    userMeasure: "#f97316",
};

export function escapeXml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Format a number for axis labels. */
function fmt(v: number): string {
    if (Math.abs(v) >= 10) return v.toFixed(1);
    if (Math.abs(v) >= 1) return v.toFixed(2);
    return v.toFixed(3);
}

/** Variant label colors used to distinguish columns in comparison charts. */
export const VARIANT_COLORS: Record<string, string> = {
    fe: "#6366f1",
    fhtml: "#06b6d4",
    "fhtml-hydrate": "#f59e0b",
};

const DEFAULT_VARIANT_COLOR = "#6b7280";

export function variantColor(variant: string): string {
    return VARIANT_COLORS[variant] ?? DEFAULT_VARIANT_COLOR;
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

    const margin = { top: 48, right: 32, bottom: 44, left: 72 };
    const plotWidth = width - margin.left - margin.right;
    const panelHeight = 80;
    const panelGap = 28;
    const totalPanelsHeight =
        metrics.length * panelHeight + (metrics.length - 1) * panelGap;
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

        // Area fill
        const areaPoints: string[] = [];
        areaPoints.push(`${toX(0)},${panelY + panelHeight}`);
        for (let i = 0; i < data.length; i++) {
            areaPoints.push(`${toX(i)},${toY(data[i])}`);
        }
        areaPoints.push(`${toX(data.length - 1)},${panelY + panelHeight}`);
        parts.push(
            `<polygon points="${areaPoints.join(" ")}" fill="${color}" opacity="0.08"/>`
        );

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

        parts.push(`</g>`);
    }

    // Shared X-axis
    const xAxisY = margin.top + totalPanelsHeight + 4;
    const sampleData = series[metrics[0]];
    const xTickCount = Math.min(Math.max(sampleData.length, 2), 10);
    parts.push(`<g>`);
    for (let t = 0; t < xTickCount; t++) {
        const dataIdx = Math.round((t * (sampleData.length - 1)) / (xTickCount - 1));
        const x =
            margin.left +
            (sampleData.length > 1
                ? (dataIdx / (sampleData.length - 1)) * plotWidth
                : plotWidth / 2);
        const iterNum = dataIdx + 1;
        parts.push(
            `<line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${
                xAxisY + 4
            }" stroke="var(--muted)" stroke-width="1"/>`
        );
        parts.push(
            `<text x="${x}" y="${
                xAxisY + 16
            }" text-anchor="middle" font-size="9" fill="var(--muted)">${iterNum}</text>`
        );
    }
    parts.push(`</g>`);

    // X-axis label
    parts.push(
        `<text x="${width / 2}" y="${
            height - 6
        }" text-anchor="middle" font-size="10" fill="var(--muted)">Iteration</text>`
    );

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

    const margin = { top: 48, right: 104, bottom: 44, left: 72 };
    const plotWidth = width - margin.left - margin.right;
    const panelHeight = 100;
    const panelGap = 36;
    const legendHeight = 28;
    const totalPanelsHeight =
        metrics.length * panelHeight + (metrics.length - 1) * panelGap;
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

            // Area fill
            const areaPoints: string[] = [];
            areaPoints.push(`${toX(0)},${panelY + panelHeight}`);
            for (let i = 0; i < data.length; i++) {
                areaPoints.push(`${toX(i)},${toY(data[i])}`);
            }
            areaPoints.push(`${toX(data.length - 1)},${panelY + panelHeight}`);
            parts.push(
                `<polygon points="${areaPoints.join(" ")}"` +
                    ` fill="${vc}" opacity="0.07"/>`
            );

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

    // Shared X-axis
    const xAxisY = contentTop + totalPanelsHeight + 4;
    const sampleData = variants[0].series[metrics[0]];
    const xTickCount = Math.min(Math.max(sampleData.length, 2), 10);
    for (let t = 0; t < xTickCount; t++) {
        const dataIdx = Math.round((t * (sampleData.length - 1)) / (xTickCount - 1));
        const x =
            margin.left +
            (sampleData.length > 1
                ? (dataIdx / (sampleData.length - 1)) * plotWidth
                : plotWidth / 2);
        const iterNum = dataIdx + 1;
        parts.push(
            `<line x1="${x}" y1="${xAxisY}"` +
                ` x2="${x}" y2="${xAxisY + 4}"` +
                ` stroke="var(--muted)" stroke-width="1"/>`
        );
        parts.push(
            `<text x="${x}" y="${xAxisY + 16}"` +
                ` text-anchor="middle" font-size="9"` +
                ` fill="var(--muted)">${iterNum}</text>`
        );
    }

    // X-axis label
    parts.push(
        `<text x="${width / 2}" y="${height - 6}"` +
            ` text-anchor="middle" font-size="10"` +
            ` fill="var(--muted)">Iteration</text>`
    );

    // Close wrapper group
    parts.push(`</g>`);

    parts.push(`</svg>`);

    return parts.join("\n");
}
