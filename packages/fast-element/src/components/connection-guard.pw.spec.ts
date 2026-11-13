import { expect, test } from "@playwright/test";

test.describe("ConnectionGuard", () => {
    test("activates preparation captures only after binding completes", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ConnectionGuard, FASTElement, html, uniqueElementName } =
                await import("/main.js");

            const captures: Array<() => boolean> = [];
            const duringPreparation: boolean[] = [];
            const duringBinding: boolean[] = [];
            const completed: Array<{
                current: boolean;
                bound: boolean;
                text: string;
            }> = [];

            class GuardTest extends FASTElement {
                public constructor() {
                    super();
                    const guard = new ConnectionGuard(this.$fastController);
                    this.$fastController.addBehavior({
                        connectedCallback() {
                            const current = guard.capture();
                            captures.push(current);
                            duringPreparation.push(current());
                        },
                    });
                }

                public connectedCallback() {
                    super.connectedCallback();
                    completed.push({
                        current: captures[captures.length - 1](),
                        bound: this.$fastController.view?.isBound ?? false,
                        text: this.shadowRoot?.textContent ?? "",
                    });
                }
            }

            await GuardTest.define({
                name: uniqueElementName(),
                template: html`${() => {
                    duringBinding.push(captures[captures.length - 1]());
                    return "prepared";
                }}`,
            });
            const element = new GuardTest();

            try {
                document.body.appendChild(element);
                element.remove();
                document.body.appendChild(element);

                return {
                    duringPreparation,
                    duringBinding,
                    completed,
                    oldCapture: captures[0](),
                    freshCapture: captures[1](),
                };
            } finally {
                element.remove();
            }
        });

        expect(result.duringPreparation).toEqual([false, false]);
        expect(result.duringBinding).toEqual([false, false]);
        expect(result.completed).toEqual([
            { current: true, bound: true, text: "prepared" },
            { current: true, bound: true, text: "prepared" },
        ]);
        expect(result.oldCapture).toBe(false);
        expect(result.freshCapture).toBe(true);
    });

    test("discards stale promise completions after reconnect and applies current work", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ConnectionGuard, FASTElement, html, uniqueElementName } =
                await import("/main.js");

            const work: Array<{
                current: () => boolean;
                resolve: (value: string) => void;
                completion: Promise<void>;
            }> = [];
            const duringConnect: boolean[] = [];
            const afterConnect: boolean[] = [];
            const applied: string[] = [];

            class GuardTest extends FASTElement {
                public constructor() {
                    super();
                    const guard = new ConnectionGuard(this.$fastController);
                    this.$fastController.addBehavior({
                        connectedCallback() {
                            const current = guard.capture();
                            duringConnect.push(current());
                            let resolve!: (value: string) => void;
                            const pending = new Promise<string>(complete => {
                                resolve = complete;
                            });
                            const completion = pending.then(value => {
                                if (current()) {
                                    applied.push(value);
                                }
                            });
                            work.push({ current, resolve, completion });
                        },
                    });
                }

                public connectedCallback() {
                    super.connectedCallback();
                    afterConnect.push(work[work.length - 1].current());
                }
            }

            await GuardTest.define({
                name: uniqueElementName(),
                template: html`<span>ready</span>`,
            });
            const element = new GuardTest();

            try {
                document.body.appendChild(element);
                const firstConnected = work[0].current();
                element.remove();
                const afterDisconnect = work[0].current();
                document.body.appendChild(element);
                const reconnected = element.$fastController.isConnected;
                const oldCaptureAfterReconnect = work[0].current();

                work[0].resolve("stale");
                await work[0].completion;
                const afterStale = [...applied];
                work[1].resolve("current");
                await work[1].completion;

                return {
                    duringConnect,
                    afterConnect,
                    firstConnected,
                    afterDisconnect,
                    reconnected,
                    oldCaptureAfterReconnect,
                    afterStale,
                    applied,
                };
            } finally {
                element.remove();
            }
        });

        expect(result.duringConnect).toEqual([false, false]);
        expect(result.afterConnect).toEqual([true, true]);
        expect(result.firstConnected).toBe(true);
        expect(result.afterDisconnect).toBe(false);
        expect(result.reconnected).toBe(true);
        expect(result.oldCaptureAfterReconnect).toBe(false);
        expect(result.afterStale).toEqual([]);
        expect(result.applied).toEqual(["current"]);
    });

    test("never revives captures made while disconnected", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ConnectionGuard, FASTElement, html, uniqueElementName } =
                await import("/main.js");

            class GuardTest extends FASTElement {}
            await GuardTest.define({
                name: uniqueElementName(),
                template: html`<span>ready</span>`,
            });
            const element = new GuardTest();
            const guard = new ConnectionGuard(element.$fastController);
            const beforeFirstConnect = guard.capture();
            const initial = beforeFirstConnect();

            try {
                document.body.appendChild(element);
                const firstConnection = beforeFirstConnect();
                const firstConnectedCapture = guard.capture();
                element.remove();
                const betweenConnections = guard.capture();
                document.body.appendChild(element);
                const current = guard.capture();

                return {
                    initial,
                    firstConnection,
                    beforeFirstConnect: beforeFirstConnect(),
                    betweenConnections: betweenConnections(),
                    firstConnectedCapture: firstConnectedCapture(),
                    current: current(),
                };
            } finally {
                element.remove();
            }
        });

        expect(result).toEqual({
            initial: false,
            firstConnection: false,
            beforeFirstConnect: false,
            betweenConnections: false,
            firstConnectedCapture: false,
            current: true,
        });
    });

    test("supports guards created while connected without coupling instances", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ConnectionGuard, FASTElement, html, uniqueElementName } =
                await import("/main.js");

            class GuardTest extends FASTElement {}
            await GuardTest.define({
                name: uniqueElementName(),
                template: html`<span>ready</span>`,
            });
            const first = new GuardTest();
            const second = new GuardTest();

            try {
                document.body.append(first, second);
                const firstGuard = new ConnectionGuard(first.$fastController);
                const anotherFirstGuard = new ConnectionGuard(first.$fastController);
                const secondGuard = new ConnectionGuard(second.$fastController);
                const firstCapture = firstGuard.capture();
                const anotherFirstCapture = anotherFirstGuard.capture();
                const secondCapture = secondGuard.capture();
                const initial = [firstCapture(), anotherFirstCapture(), secondCapture()];

                first.remove();
                const detached = [firstCapture(), anotherFirstCapture(), secondCapture()];
                document.body.appendChild(first);
                const reconnected = [
                    firstCapture(),
                    anotherFirstCapture(),
                    secondCapture(),
                    firstGuard.capture()(),
                    anotherFirstGuard.capture()(),
                ];

                return { initial, detached, reconnected };
            } finally {
                first.remove();
                second.remove();
            }
        });

        expect(result.initial).toEqual([true, true, true]);
        expect(result.detached).toEqual([false, false, true]);
        expect(result.reconnected).toEqual([false, false, true, true, true]);
    });
});
