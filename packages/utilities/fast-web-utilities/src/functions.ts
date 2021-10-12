/**
 * Higher-order throttler geenrator, used for testing.
 * @internal
 */
export function makeThrottler(
    timeProvider: () => number,
    setTimeout: (fn: () => void, number) => number
): (fn: () => void, interval: number) => () => void {
    return (fn: () => void, interval: number): (() => void) => {
        let scheduled: boolean = false;
        let lastExecutedAt: number = -Infinity;
        return (): void => {
            const now = timeProvider();
            const nextPossibleExecution = lastExecutedAt + interval;
            if (scheduled) {
                // explicit no-op. It is possible that `nextPossibleExecution`
                // is >= now with a pending timeout.
            } else if (now >= nextPossibleExecution) {
                lastExecutedAt = now;
                fn();
            } else if (!scheduled) {
                scheduled = true;
                setTimeout(() => {
                    lastExecutedAt = timeProvider();
                    scheduled = false;
                    fn();
                }, nextPossibleExecution - now);
            }
        };
    };
}

/**
 * A leading-edge throttle the executed function to run at most every
 * "interval" number of milliseconds.
 */
export const throttle = makeThrottler(performance.now.bind(performance), setTimeout);
