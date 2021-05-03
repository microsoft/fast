/* eslint-disable */

/**
 * Collect a diff between a baseline and a benchmark
 * @returns {{hz: number, mean: number}}
 */
module.exports = (baseline, benchmark) => {
    return {
        hz: benchmark.hz - baseline.hz,
        mean: benchmark.stats.mean - baseline.stats.mean,
    };
};
