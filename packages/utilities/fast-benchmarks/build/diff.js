/* eslint-disable */

/**
 * Collect a diff between a baseline and a benchmark
 * @returns {{hz: number, mean: number}}
 */
module.exports = (baseline, benchmark) => {
    return {
        hz: benchmark.hz - baseline.hz,
        "hz percentage": ((benchmark.hz - baseline.hz) / baseline.hz) * 100,
        mean: benchmark.stats.mean - baseline.stats.mean,
        "mean percentage":
            ((benchmark.stats.mean - baseline.stats.mean) / baseline.stats.mean) * 100,
    };
};
