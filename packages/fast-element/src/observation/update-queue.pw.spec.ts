import { expect, test } from "@playwright/test";

const waitMilliseconds = 100;
const maxRecursion = 10;

test.describe("The UpdateQueue", () => {
    test.describe("when updating DOM asynchronously", () => {
        test("calls task in a future turn", async ({ page }) => {
            await page.goto("/");

            const { calledBefore, calledAfter } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                let called = false;

                Updates.enqueue(() => {
                    called = true;
                });

                const calledBefore = called;

                await new Promise(resolve => setTimeout(resolve, 100));

                const calledAfter = called;

                return { calledBefore, calledAfter };
            });

            expect(calledBefore).toBe(false);
            expect(calledAfter).toBe(true);
        });

        test("calls task.call method in a future turn", async ({ page }) => {
            await page.goto("/");

            const { calledBefore, calledAfter } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                let called = false;

                Updates.enqueue({
                    call: () => {
                        called = true;
                    },
                });

                const calledBefore = called;

                await new Promise(resolve => setTimeout(resolve, 100));

                const calledAfter = called;

                return { calledBefore, calledAfter };
            });

            expect(calledBefore).toBe(false);
            expect(calledAfter).toBe(true);
        });

        test("calls multiple tasks in order", async ({ page }) => {
            await page.goto("/");

            const { callsBefore, callsAfter } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);
                });
                Updates.enqueue(() => {
                    calls.push(1);
                });
                Updates.enqueue(() => {
                    calls.push(2);
                });

                const callsBefore = JSON.parse(JSON.stringify(calls));

                await new Promise(resolve => setTimeout(resolve, 100));

                const callsAfter = JSON.parse(JSON.stringify(calls));

                return { callsBefore, callsAfter };
            });

            expect(callsBefore).toEqual([]);
            expect(callsAfter).toEqual([0, 1, 2]);
        });

        test("calls tasks in breadth-first order", async ({ page }) => {
            await page.goto("/");

            const { callsBefore, callsAfter } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                let calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);

                    Updates.enqueue(() => {
                        calls.push(2);

                        Updates.enqueue(() => {
                            calls.push(5);
                        });

                        Updates.enqueue(() => {
                            calls.push(6);
                        });
                    });

                    Updates.enqueue(() => {
                        calls.push(3);
                    });
                });

                Updates.enqueue(() => {
                    calls.push(1);

                    Updates.enqueue(() => {
                        calls.push(4);
                    });
                });

                const callsBefore = JSON.parse(JSON.stringify(calls));

                await new Promise(resolve => setTimeout(resolve, 100));

                const callsAfter = JSON.parse(JSON.stringify(calls));

                return { callsBefore, callsAfter };
            });

            expect(callsBefore).toEqual([]);
            expect(callsAfter).toEqual([0, 1, 2, 3, 4, 5, 6]);
        });

        test("can schedule more than capacity tasks", async ({ page }) => {
            await page.goto("/");

            const { targetList, newList } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const target = 1060;
                const targetList: number[] = [];

                for (var i = 0; i < target; i++) {
                    targetList.push(i);
                }

                const newList: number[] = [];
                for (var i = 0; i < target; i++) {
                    (function (i) {
                        Updates.enqueue(() => {
                            newList.push(i);
                        });
                    })(i);
                }

                await new Promise(resolve => setTimeout(resolve, 100));

                return { targetList, newList };
            });

            expect(newList).toEqual(targetList);
        });

        test("can schedule more than capacity*2 tasks", async ({ page }) => {
            await page.goto("/");

            const { targetList, newList } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const target = 2060;
                const targetList: number[] = [];

                for (var i = 0; i < target; i++) {
                    targetList.push(i);
                }

                const newList: number[] = [];
                for (var i = 0; i < target; i++) {
                    (function (i) {
                        Updates.enqueue(() => {
                            newList.push(i);
                        });
                    })(i);
                }

                await new Promise(resolve => setTimeout(resolve, 100));

                return { targetList, newList };
            });

            expect(newList).toEqual(targetList);
        });

        test("can schedule tasks recursively", async ({ page }) => {
            await page.goto("/");

            const steps = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const steps: number[] = [];

                Updates.enqueue(() => {
                    steps.push(0);
                    Updates.enqueue(() => {
                        steps.push(2);
                        Updates.enqueue(() => {
                            steps.push(4);
                        });
                        steps.push(3);
                    });
                    steps.push(1);
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                return steps;
            });

            expect(steps).toEqual([0, 1, 2, 3, 4]);
        });

        test(`can recurse ${maxRecursion} tasks deep`, async ({ page }) => {
            await page.goto("/");

            const recurseCount = await page.evaluate(async maxRecursion => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                let recurseCount = 0;
                function go() {
                    if (++recurseCount < maxRecursion) {
                        Updates.enqueue(go);
                    }
                }

                Updates.enqueue(go);

                await new Promise(resolve => setTimeout(resolve, 100));

                return recurseCount;
            }, maxRecursion);

            expect(recurseCount).toBe(maxRecursion);
        });

        test("can execute two branches of recursion in parallel", async ({ page }) => {
            await page.goto("/");

            const { callsLength, calls } = await page.evaluate(async maxRecursion => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                let recurseCount1 = 0;
                let recurseCount2 = 0;
                const calls: number[] = [];

                function go1() {
                    calls.push(recurseCount1 * 2);
                    if (++recurseCount1 < maxRecursion) {
                        Updates.enqueue(go1);
                    }
                }

                function go2() {
                    calls.push(recurseCount2 * 2 + 1);
                    if (++recurseCount2 < maxRecursion) {
                        Updates.enqueue(go2);
                    }
                }

                Updates.enqueue(go1);
                Updates.enqueue(go2);

                await new Promise(resolve => setTimeout(resolve, 100));

                return { callsLength: calls.length, calls };
            }, maxRecursion);

            expect(callsLength).toBe(maxRecursion * 2);
            for (let index = 0; index < maxRecursion * 2; index++) {
                expect(calls[index]).toBe(index);
            }
        });

        test("throws errors in order without breaking the queue", async ({ page }) => {
            await page.goto("/");

            const { callsBefore, callsAfter, errors } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                const calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);
                    throw 0;
                });

                Updates.enqueue(() => {
                    calls.push(1);
                    throw 1;
                });

                Updates.enqueue(() => {
                    calls.push(2);
                    throw 2;
                });

                const callsBefore = JSON.parse(JSON.stringify(calls));

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                const callsAfter = JSON.parse(JSON.stringify(calls));

                return { callsBefore, callsAfter, errors };
            });

            expect(callsBefore).toEqual([]);
            expect(callsAfter).toEqual([0, 1, 2]);
            expect(errors).toEqual([0, 1, 2]);
        });

        test("preserves the respective order of errors interleaved among successes", async ({
            page,
        }) => {
            await page.goto("/");

            const { callsBefore, callsAfter, errors } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                const calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);
                });
                Updates.enqueue(() => {
                    calls.push(1);
                    throw 1;
                });
                Updates.enqueue(() => {
                    calls.push(2);
                });
                Updates.enqueue(() => {
                    calls.push(3);
                    throw 3;
                });
                Updates.enqueue(() => {
                    calls.push(4);
                    throw 4;
                });
                Updates.enqueue(() => {
                    calls.push(5);
                });

                const callsBefore = JSON.parse(JSON.stringify(calls));

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                const callsAfter = JSON.parse(JSON.stringify(calls));

                return { callsBefore, callsAfter, errors };
            });

            expect(callsBefore).toEqual([]);
            expect(callsAfter).toEqual([0, 1, 2, 3, 4, 5]);
            expect(errors).toEqual([1, 3, 4]);
        });

        test("executes tasks scheduled by another task that later throws an error", async ({
            page,
        }) => {
            await page.goto("/");

            const errors = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                Updates.enqueue(() => {
                    Updates.enqueue(() => {
                        throw 1;
                    });

                    throw 0;
                });

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                return errors;
            });

            expect(errors).toEqual([0, 1]);
        });

        test("executes a tree of tasks in breadth-first order when some tasks throw errors", async ({
            page,
        }) => {
            await page.goto("/");

            const { callsBefore, callsAfter, errors } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                const calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);

                    Updates.enqueue(() => {
                        calls.push(2);

                        Updates.enqueue(() => {
                            calls.push(5);
                            throw 5;
                        });

                        Updates.enqueue(() => {
                            calls.push(6);
                        });
                    });

                    Updates.enqueue(() => {
                        calls.push(3);
                    });

                    throw 0;
                });

                Updates.enqueue(() => {
                    calls.push(1);

                    Updates.enqueue(() => {
                        calls.push(4);
                        throw 4;
                    });
                });

                const callsBefore = JSON.parse(JSON.stringify(calls));

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                const callsAfter = JSON.parse(JSON.stringify(calls));

                return { callsBefore, callsAfter, errors };
            });

            expect(callsBefore).toEqual([]);
            expect(callsAfter).toEqual([0, 1, 2, 3, 4, 5, 6]);
            expect(errors).toEqual([0, 4, 5]);
        });

        test("rethrows task errors and preserves the order of recursive tasks", async ({
            page,
        }) => {
            await page.goto("/");

            const { recursionCount, errors } = await page.evaluate(async maxRecursion => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                let recursionCount = 0;

                function go() {
                    if (++recursionCount < maxRecursion) {
                        Updates.enqueue(go);
                        throw recursionCount - 1;
                    }
                }

                Updates.enqueue(go);

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                return { recursionCount, errors };
            }, maxRecursion);

            expect(recursionCount).toBe(maxRecursion);
            expect(errors.length).toBe(maxRecursion - 1);

            for (let index = 0; index < maxRecursion - 1; index++) {
                expect(errors[index]).toBe(index);
            }
        });

        test("can execute three parallel deep recursions in order, one of which throwing every task", async ({
            page,
        }) => {
            await page.goto("/");

            const { calls, errors } = await page.evaluate(async maxRecursion => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                const errors: number[] = [];
                const originalSetTimeout = globalThis.setTimeout;

                globalThis.setTimeout = ((callback: Function, timeout: number) => {
                    return originalSetTimeout(() => {
                        try {
                            callback();
                        } catch (error) {
                            errors.push(error as number);
                        }
                    }, timeout);
                }) as any;

                let recurseCount1 = 0;
                let recurseCount2 = 0;
                let recurseCount3 = 0;
                let calls: number[] = [];

                function go1() {
                    calls.push(recurseCount1 * 3);
                    if (++recurseCount1 < maxRecursion) {
                        Updates.enqueue(go1);
                    }
                }

                function go2() {
                    calls.push(recurseCount2 * 3 + 1);
                    if (++recurseCount2 < maxRecursion) {
                        Updates.enqueue(go2);
                    }
                }

                function go3() {
                    calls.push(recurseCount3 * 3 + 2);
                    if (++recurseCount3 < maxRecursion) {
                        Updates.enqueue(go3);
                        throw recurseCount3 - 1;
                    }
                }

                Updates.enqueue(go1);
                Updates.enqueue(go2);
                Updates.enqueue(go3);

                await new Promise(resolve => originalSetTimeout(resolve, 100));

                globalThis.setTimeout = originalSetTimeout;

                return { calls, errors };
            }, maxRecursion);

            expect(calls.length).toBe(maxRecursion * 3);
            for (let index = 0; index < maxRecursion * 3; index++) {
                expect(calls[index]).toBe(index);
            }

            expect(errors.length).toBe(maxRecursion - 1);
            for (let index = 0; index < maxRecursion - 1; index++) {
                expect(errors[index]).toBe(index);
            }
        });
    });

    test.describe("when updating DOM synchronously", () => {
        test("calls task immediately", async ({ page }) => {
            await page.goto("/");

            const called = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                let called = false;

                Updates.enqueue(() => {
                    called = true;
                });

                Updates.setMode(true);

                return called;
            });

            expect(called).toBe(true);
        });

        test("calls task.call method immediately", async ({ page }) => {
            await page.goto("/");

            const called = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                let called = false;

                Updates.enqueue({
                    call: () => {
                        called = true;
                    },
                });

                Updates.setMode(true);

                return called;
            });

            expect(called).toBe(true);
        });

        test("calls multiple tasks in order", async ({ page }) => {
            await page.goto("/");

            const calls = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                const calls: number[] = [];

                Updates.enqueue(() => {
                    calls.push(0);
                });
                Updates.enqueue(() => {
                    calls.push(1);
                });
                Updates.enqueue(() => {
                    calls.push(2);
                });

                Updates.setMode(true);

                return calls;
            });

            expect(calls).toEqual([0, 1, 2]);
        });

        test("can schedule tasks recursively", async ({ page }) => {
            await page.goto("/");

            const steps = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                const steps: number[] = [];

                Updates.enqueue(() => {
                    steps.push(0);
                    Updates.enqueue(() => {
                        steps.push(2);
                        Updates.enqueue(() => {
                            steps.push(4);
                        });
                        steps.push(3);
                    });
                    steps.push(1);
                });

                Updates.setMode(true);

                return steps;
            });

            expect(steps).toEqual([0, 1, 2, 3, 4]);
        });

        test(`can recurse ${maxRecursion} tasks deep`, async ({ page }) => {
            await page.goto("/");

            const recurseCount = await page.evaluate(async maxRecursion => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                let recurseCount = 0;
                function go() {
                    if (++recurseCount < maxRecursion) {
                        Updates.enqueue(go);
                    }
                }

                Updates.enqueue(go);

                Updates.setMode(true);

                return recurseCount;
            }, maxRecursion);

            expect(recurseCount).toBe(maxRecursion);
        });

        test("throws errors immediately", async ({ page }) => {
            await page.goto("/");

            const { calls, caught } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Updates } = await import("/main.js");

                Updates.setMode(false);

                const calls: number[] = [];
                let caught: any;

                try {
                    Updates.enqueue(() => {
                        calls.push(0);
                        throw 0;
                    });
                } catch (error) {
                    caught = error;
                }

                Updates.setMode(true);

                return { calls, caught };
            });

            expect(calls).toEqual([0]);
            expect(caught).toEqual(0);
        });
    });
});
