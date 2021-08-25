/* eslint-disable */

function percentChange(a, b) {
    return ((a - b) / b) * 100;
}

/**
 * Collect a diff between a baseline and a benchmark
 * @returns {{hz: number, mean: number}}
 */
module.exports = (baseline, benchmark) => {
    return {
        hz: benchmark.hz - baseline.hz,
        "hz percentage": percentChange(benchmark.hz, baseline.hz),
        mean: benchmark.stats.mean - baseline.stats.mean,
        "mean percentage": percentChange(benchmark.stats.mean, baseline.stats.mean),
    };
};
