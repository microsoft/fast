/**
 * CDP trace event parsing utilities for extracting rendering pipeline metrics.
 *
 * Trace categories captured:
 * - `devtools.timeline` — Layout, RecalculateStyles, Paint, etc.
 * - `v8.execute` — JavaScript execution
 * - `blink.user_timing` — performance.mark / performance.measure entries
 */

/** Category strings to pass to `Tracing.start`. */
export const TRACE_CATEGORIES = [
    "devtools.timeline",
    "v8.execute",
    "blink.user_timing",
    "loading",
] as const;

/** Trace event phases we care about. */
type Phase = "B" | "E" | "X" | "I" | "R" | "b" | "e";

/** A single raw trace event from the CDP `Tracing.dataCollected` payload. */
export interface TraceEvent {
    cat: string;
    name: string;
    ph: Phase;
    ts: number; // microseconds
    dur?: number; // microseconds (for "X" / complete events)
    pid: number;
    tid: number;
    args?: Record<string, unknown>;
}

/** Parsed timing breakdown for a single benchmark run. */
export interface TraceMetrics {
    /** Total scripting time (EvaluateScript + FunctionCall) in ms. */
    scripting: number;
    /** Total layout time in ms. */
    layout: number;
    /** Total style recalculation time in ms. */
    styleRecalc: number;
    /** Total paint time in ms. */
    paint: number;
    /** Sum of scripting + layout + styleRecalc + paint. */
    total: number;
    /** Duration from the user-timing "bench" measure, if present (ms). */
    userMeasure: number;
    /** First Contentful Paint relative to navigation start (ms), or -1 if not available. */
    fcp: number;
    /** Largest Contentful Paint relative to navigation start (ms), or -1 if not available. */
    lcp: number;
    /** DOMContentLoaded relative to navigation start (ms), or -1 if not available. */
    dcl: number;
}

/**
 * Names of `devtools.timeline` events that represent rendering work.
 * Durations are in the `dur` field for complete ("X") events.
 */
const SCRIPTING_EVENTS = new Set([
    "EvaluateScript",
    "FunctionCall",
    "v8.compile",
    "v8.compileModule",
    "v8.evaluateModule",
    "EventDispatch",
    "TimerFire",
    "FireAnimationFrame",
]);
const LAYOUT_EVENTS = new Set(["Layout"]);
const STYLE_EVENTS = new Set(["UpdateLayoutTree", "RecalculateStyles"]);
const PAINT_EVENTS = new Set([
    "Paint",
    "PrePaint",
    "PaintImage",
    "Layerize",
    "CompositeLayers",
]);

/**
 * Find the time range of the benchmark's user-timing marks so we can scope
 * trace events to only the work that happened during the benchmark.
 */
function findBenchmarkRange(events: TraceEvent[]): { start: number; end: number } | null {
    let start = -1;
    let end = -1;

    for (const ev of events) {
        if (ev.cat.includes("blink.user_timing")) {
            if (ev.name === "bench-start" && (ev.ph === "I" || ev.ph === "R")) {
                start = ev.ts;
            }
            if (ev.name === "bench-end" && (ev.ph === "I" || ev.ph === "R")) {
                end = ev.ts;
            }
        }
    }

    // If we found the marks, use them.
    if (start > 0 && end > 0) {
        return { start, end };
    }

    // Fall back to the "bench" measure (async begin/end or complete event).
    let measureStart = -1;
    let measureEnd = -1;
    for (const ev of events) {
        if (ev.cat.includes("blink.user_timing") && ev.name === "bench") {
            if (ev.ph === "b") {
                measureStart = ev.ts;
            }
            if (ev.ph === "e") {
                measureEnd = ev.ts;
            }
            if (ev.ph === "X" && ev.dur != null) {
                return { start: ev.ts, end: ev.ts + ev.dur };
            }
        }
    }

    if (measureStart > 0 && measureEnd > 0) {
        return { start: measureStart, end: measureEnd };
    }

    return null;
}

/**
 * Sum durations of complete ("X") trace events whose names match the given set,
 * scoped to the benchmark's time range. Uses a generous end boundary to capture
 * layout/paint work triggered by the benchmark but completed after `bench-end`.
 */
function sumCategory(
    events: TraceEvent[],
    names: Set<string>,
    rangeStart: number,
    rangeEnd: number
): number {
    let totalUs = 0;

    for (const ev of events) {
        if (ev.ph !== "X" || ev.dur == null) {
            continue;
        }

        if (!names.has(ev.name)) {
            continue;
        }

        const evStart = ev.ts;
        const evEnd = ev.ts + ev.dur;

        // Include events that overlap with our range.
        if (evEnd > rangeStart && evStart < rangeEnd) {
            // Clamp to the range boundaries.
            const clampedStart = Math.max(evStart, rangeStart);
            const clampedEnd = Math.min(evEnd, rangeEnd);
            totalUs += clampedEnd - clampedStart;
        }
    }

    return totalUs / 1000; // Convert microseconds → milliseconds.
}

/**
 * Extract navigation-relative timing metrics (FCP, LCP, DCL) in a single
 * pass over the events. Finds the last navigationStart before bench-start,
 * then computes each metric relative to it. Returns -1 for any metric
 * whose trace event was not emitted.
 */
function extractNavMetrics(
    events: TraceEvent[],
    benchStart: number
): { fcp: number; lcp: number; dcl: number } {
    let navStart = -1;
    let fcp = -1;
    let lcp = -1;
    let dcl = -1;

    // First pass: find the last navigationStart before bench-start.
    for (const ev of events) {
        if (
            ev.cat.includes("blink.user_timing") &&
            ev.name === "navigationStart" &&
            (ev.ph === "I" || ev.ph === "R") &&
            ev.ts <= benchStart
        ) {
            navStart = ev.ts;
        }
    }

    if (navStart < 0) {
        return { fcp, lcp, dcl };
    }

    // Second pass: extract FCP, LCP, DCL relative to navStart.
    for (const ev of events) {
        if (ev.ts < navStart || (ev.ph !== "I" && ev.ph !== "R")) {
            continue;
        }

        if (
            ev.name === "firstContentfulPaint" &&
            ev.cat.includes("devtools.timeline") &&
            fcp < 0
        ) {
            fcp = (ev.ts - navStart) / 1000;
        } else if (
            ev.name === "largestContentfulPaint::Candidate" &&
            ev.cat.includes("devtools.timeline")
        ) {
            lcp = (ev.ts - navStart) / 1000; // take the last candidate
        } else if (
            ev.name === "MarkDOMContent" &&
            ev.cat.includes("devtools.timeline") &&
            dcl < 0
        ) {
            dcl = (ev.ts - navStart) / 1000;
        }
    }

    return { fcp, lcp, dcl };
}

/**
 * Extract the user-timing "bench" measure duration from trace events.
 */
function extractUserMeasure(events: TraceEvent[]): number {
    let start = -1;
    let end = -1;

    for (const ev of events) {
        if (ev.cat.includes("blink.user_timing") && ev.name === "bench") {
            // Complete event (unlikely but handle it)
            if (ev.ph === "X" && ev.dur != null) {
                return ev.dur / 1000;
            }
            // Async begin/end pair (Chrome's actual format)
            if (ev.ph === "b") {
                start = ev.ts;
            }
            if (ev.ph === "e") {
                end = ev.ts;
            }
        }
    }

    if (start > 0 && end > 0) {
        return (end - start) / 1000;
    }

    return -1;
}

/**
 * Parse raw CDP trace events into a structured metrics object.
 *
 * The time range extends from `bench-start` to 50ms past `bench-end` to
 * capture layout and paint work that the browser performs asynchronously
 * after the synchronous benchmark code completes.
 */
export function parseTraceEvents(events: TraceEvent[]): TraceMetrics {
    const range = findBenchmarkRange(events);
    const benchStart = range?.start ?? -1;
    const { fcp, lcp, dcl } =
        benchStart > 0
            ? extractNavMetrics(events, benchStart)
            : { fcp: -1, lcp: -1, dcl: -1 };

    if (!range) {
        return {
            scripting: -1,
            layout: -1,
            styleRecalc: -1,
            paint: -1,
            total: -1,
            userMeasure: extractUserMeasure(events),
            fcp,
            lcp,
            dcl,
        };
    }

    // Extend the end boundary to capture async rendering work (layout, paint)
    // that's triggered by the benchmark but completes after bench-end.
    const extendedEnd = range.end + 50_000; // 50ms in microseconds

    const scripting = sumCategory(events, SCRIPTING_EVENTS, range.start, range.end);
    const layout = sumCategory(events, LAYOUT_EVENTS, range.start, extendedEnd);
    const styleRecalc = sumCategory(events, STYLE_EVENTS, range.start, extendedEnd);
    const paint = sumCategory(events, PAINT_EVENTS, range.start, extendedEnd);

    return {
        scripting,
        layout,
        styleRecalc,
        paint,
        total: scripting + layout + styleRecalc + paint,
        userMeasure: extractUserMeasure(events),
        fcp,
        lcp,
        dcl,
    };
}

/** Metric key names in display order. */
export const TRACE_METRIC_KEYS = [
    "scripting",
    "layout",
    "styleRecalc",
    "paint",
    "total",
    "userMeasure",
    "fcp",
    "lcp",
    "dcl",
] as const;

export type TraceMetricKey = (typeof TRACE_METRIC_KEYS)[number];

/** Per-iteration metric arrays for a full benchmark run. */
export type TraceMetricSeries = Record<TraceMetricKey, number[]>;

/** Convert an array of per-iteration metrics into column-oriented series. */
export function toMetricSeries(metrics: TraceMetrics[]): TraceMetricSeries {
    return {
        scripting: metrics.map(m => m.scripting),
        layout: metrics.map(m => m.layout),
        styleRecalc: metrics.map(m => m.styleRecalc),
        paint: metrics.map(m => m.paint),
        total: metrics.map(m => m.total),
        userMeasure: metrics.map(m => m.userMeasure),
        fcp: metrics.map(m => m.fcp),
        lcp: metrics.map(m => m.lcp),
        dcl: metrics.map(m => m.dcl),
    };
}

/**
 * Compute summary statistics for an array of numbers.
 */
export function computeStats(values: number[]): {
    min: number;
    median: number;
    mean: number;
    geoMean: number;
    p95: number;
    max: number;
} {
    const sorted = [...values].sort((a, b) => a - b);
    const len = sorted.length;
    const geoMean =
        len > 0
            ? Math.exp(
                  values.reduce((acc, v) => acc + Math.log(Math.max(v, 1e-9)), 0) / len
              )
            : 0;
    return {
        min: sorted[0],
        median: sorted[Math.floor(len / 2)],
        mean: values.reduce((a, b) => a + b, 0) / len,
        geoMean,
        p95: sorted[Math.floor(len * 0.95)],
        max: sorted[len - 1],
    };
}
