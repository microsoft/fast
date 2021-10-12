import chai, { expect } from "chai";
import { makeThrottler } from ".";

describe("functions", (): void => {
    describe("throttler", (): void => {
        let now: number;
        let queue: { at: number; fn: () => void }[];
        let throttler: ReturnType<typeof makeThrottler>;

        beforeEach((): void => {
            now = 0;
            queue = [];
            throttler = makeThrottler(
                () => now,
                (fn: () => void, at: number): number => {
                    queue.push({ at, fn });
                    return queue.length;
                }
            );
        });

        const advanceTime = (by: number): void => {
            const target = now + by;
            while (queue.length && queue[0].at <= target) {
                now = queue[0].at;
                queue.shift().fn();
            }

            now = target;
        };

        it("executes on leading edge", () => {
            const spy = chai.spy();
            const t = throttler(spy, 100);
            t();
            expect(spy).to.have.been.called.once;
            expect(queue.length).to.equal(0);
        });

        it("defers subsequent calls exactly once", () => {
            const spy = chai.spy();
            const t = throttler(spy, 100);
            t();
            for (let i = 0; i < 9; i++) {
                t();
            }
            expect(spy).to.have.been.called.once;
            advanceTime(100);
            expect(spy).to.have.been.called.twice;
        });

        it("includes partial interval since last call", () => {
            const spy = chai.spy();
            const t = throttler(spy, 100);
            t();
            t();
            advanceTime(100);
            expect(spy).to.have.been.called.twice;
            advanceTime(50);
            t();
            expect(spy).to.have.been.called.twice;
            advanceTime(50);
            expect(spy).to.have.been.called.exactly(3);
        });
    });
});
