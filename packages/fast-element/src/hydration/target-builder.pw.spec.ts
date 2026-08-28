import { expect, test } from "@playwright/test";

test.describe("buildViewBindingTargets", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("bounds Range.comparePoint calls by element marker processing", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const root = document.createElement("div");
            root.innerHTML = `
                <section>
                    <i id="before" data-fe="1"></i>
                    <span id="first" data-fe="1"><b id="first-child" data-fe="1"></b></span>
                </section>
                <section id="candidates">
                    ${Array.from(
                        { length: 100 },
                        (_, index) => `<span id="candidate-${index}"></span>`,
                    ).join("")}
                </section>
                <section>
                    <em id="middle" data-fe="1"></em>
                    <div id="last" data-fe="1"><u id="last-child" data-fe="1"></u></div>
                    <strong id="after" data-fe="1"></strong>
                </section>
            `;

            const first = root.querySelector("#first")!;
            const last = root.querySelector("#last")!;
            const after = root.querySelector("#after")!;
            const candidateWalker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_ELEMENT,
            );
            candidateWalker.currentNode = first;
            let candidateCount = 1;

            while (candidateWalker.nextNode() !== after) {
                candidateCount++;
            }

            const originalComparePoint = Range.prototype.comparePoint;
            let comparePointCalls = 0;

            let targets: Record<string, Node>;
            try {
                Range.prototype.comparePoint = function (
                    node: Node,
                    offset: number,
                ): number {
                    comparePointCalls++;
                    return originalComparePoint.call(this, node, offset);
                };
                ({ targets } = buildViewBindingTargets(
                    first,
                    last,
                    ["first", "firstChild", "middle", "last", "lastChild"].map(
                        targetNodeId => ({ targetNodeId }),
                    ),
                ));
            } finally {
                Range.prototype.comparePoint = originalComparePoint;
            }

            return {
                targets: Object.fromEntries(
                    Object.entries(targets!).map(([key, node]) => [
                        key,
                        (node as Element).id,
                    ]),
                ),
                beforeMarker: root.querySelector("#before")!.getAttribute("data-fe"),
                afterMarker: root.querySelector("#after")!.getAttribute("data-fe"),
                lastChildMarker: root
                    .querySelector("#last-child")!
                    .getAttribute("data-fe"),
                candidateCount,
                markerProcessingEvents: 5,
                comparePointCalls,
            };
        });

        expect(result).toMatchObject({
            targets: {
                first: "first",
                firstChild: "first-child",
                middle: "middle",
                last: "last",
                lastChild: "last-child",
            },
            beforeMarker: "1",
            afterMarker: "1",
            lastChildMarker: null,
        });
        expect(result.comparePointCalls).toBeGreaterThan(0);
        expect(result.comparePointCalls).toBeLessThanOrEqual(
            result.markerProcessingEvents,
        );
        expect(result.comparePointCalls).toBeLessThan(result.candidateCount / 10);
    });

    test("avoids Range.comparePoint for content-only traversal", async ({ page }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const root = document.createElement("div");
            root.innerHTML = `<!--fe:b-->content<!--fe:/b-->`;
            const originalComparePoint = Range.prototype.comparePoint;
            let comparePointCalls = 0;
            let targets: Record<string, Node>;

            try {
                Range.prototype.comparePoint = function (
                    node: Node,
                    offset: number,
                ): number {
                    comparePointCalls++;
                    return originalComparePoint.call(this, node, offset);
                };
                ({ targets } = buildViewBindingTargets(
                    root.firstChild!,
                    root.lastChild!,
                    [{ targetNodeId: "content" }],
                ));
            } finally {
                Range.prototype.comparePoint = originalComparePoint;
            }

            return {
                target: targets!.content.textContent,
                comparePointCalls,
            };
        });

        expect(result).toEqual({
            target: "content",
            comparePointCalls: 0,
        });
    });

    test("includes descendants when both endpoints are the same node", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const element = document.createElement("div");
            element.id = "endpoint";
            element.setAttribute("data-fe", "1");
            element.innerHTML = `<span id="child" data-fe="1"></span>`;

            const { targets } = buildViewBindingTargets(
                element,
                element,
                ["endpoint", "child"].map(targetNodeId => ({ targetNodeId })),
            );

            const emptyElement = document.createElement("div");
            emptyElement.id = "empty";
            emptyElement.setAttribute("data-fe", "1");
            const emptyTarget = buildViewBindingTargets(emptyElement, emptyElement, [
                { targetNodeId: "empty" },
            ]).targets.empty;

            const text = document.createTextNode("text");
            const comment = document.createComment("comment");
            buildViewBindingTargets(text, text, []);
            buildViewBindingTargets(comment, comment, []);

            return {
                ...Object.fromEntries(
                    Object.entries(targets).map(([key, node]) => [
                        key,
                        (node as Element).id,
                    ]),
                ),
                empty: (emptyTarget as Element).id,
            };
        });

        expect(result).toEqual({
            endpoint: "endpoint",
            child: "child",
            empty: "empty",
        });
    });

    test("preserves first-only behavior for reversed and separate roots", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            function targetId(first: Element, last: Node): string {
                first.setAttribute("data-fe", "1");
                const { targets } = buildViewBindingTargets(first, last, [
                    { targetNodeId: "target" },
                ]);
                return (targets.target as Element).id;
            }

            const reversed = document.createElement("div");
            reversed.innerHTML = `<span id="earlier"></span><span id="later"></span>`;

            const separateFirst = document.createElement("div");
            separateFirst.id = "separate-first";
            const separateLast = document.createElement("div");

            const shadowHostA = document.createElement("div");
            const shadowHostB = document.createElement("div");
            const shadowFirst = document.createElement("span");
            shadowFirst.id = "shadow-first";
            const shadowLast = document.createElement("span");
            shadowHostA.attachShadow({ mode: "open" }).append(shadowFirst);
            shadowHostB.attachShadow({ mode: "open" }).append(shadowLast);

            return {
                reversed: targetId(
                    reversed.querySelector("#later")!,
                    reversed.querySelector("#earlier")!,
                ),
                separate: targetId(separateFirst, separateLast),
                shadow: targetId(shadowFirst, shadowLast),
            };
        });

        expect(result).toEqual({
            reversed: "later",
            separate: "separate-first",
            shadow: "shadow-first",
        });
    });

    test("walks from a non-leaf first endpoint through an ancestor last endpoint", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            function createLast() {
                const last = document.createElement("div");
                last.innerHTML = `
                    <section>
                        <span id="first" data-fe="1">
                            <i id="first-child" data-fe="1"></i>
                        </span>
                        <em id="following-sibling" data-fe="1"></em>
                    </section>
                    <strong id="following-branch" data-fe="1"></strong>
                `;
                return last;
            }

            const legacyLast = createLast();
            const legacyFirst = legacyLast.querySelector("#first")!;
            const range = document.createRange();
            range.setStart(legacyFirst, 0);
            range.setEnd(legacyLast, legacyLast.childNodes.length);
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode(node) {
                        return range.comparePoint(node, 0) === 0
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    },
                },
            );
            const legacy: string[] = [];
            let legacyNode: Node | null = (walker.currentNode = legacyFirst);
            while (legacyNode !== null) {
                legacy.push((legacyNode as Element).id);
                legacyNode = walker.nextNode();
            }
            range.detach();

            const last = createLast();
            const first = last.querySelector("#first")!;

            const { targets } = buildViewBindingTargets(
                first,
                last,
                ["first", "firstChild", "followingSibling", "followingBranch"].map(
                    targetNodeId => ({ targetNodeId }),
                ),
            );

            return {
                legacy,
                targets: Object.values(targets).map(node => (node as Element).id),
            };
        });

        expect(result).toEqual({
            legacy: ["first", "first-child", "following-sibling", "following-branch"],
            targets: ["first", "first-child", "following-sibling", "following-branch"],
        });
    });

    test("fails closed when attribute removal synchronously removes or moves the endpoint", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class EndpointMutator extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const endpoint = this.parentElement!.querySelector("[data-endpoint]");

                    if (this.dataset.mutation === "remove") {
                        endpoint!.remove();
                    } else {
                        this.parentElement!.append(endpoint!);
                    }
                }
            }

            customElements.define("endpoint-mutator", EndpointMutator);

            function createRoot(mutation: "remove" | "move") {
                const root = document.createElement("div");
                root.innerHTML = `
                    <endpoint-mutator
                        id="first"
                        data-fe="1"
                        data-mutation="${mutation}"
                    ></endpoint-mutator>
                    <span id="middle" data-fe="1"></span>
                    <i id="last" data-fe="1" data-endpoint></i>
                    <b id="after" data-fe="1"></b>
                `;
                return root;
            }

            function walkLegacy(mutation: "remove" | "move") {
                const root = createRoot(mutation);
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);
                while (node !== null) {
                    const element = node as Element;
                    visited.push(element.id);
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }
                range.detach();
                return visited;
            }

            function build(mutation: "remove" | "move") {
                const root = createRoot(mutation);

                const { targets } = buildViewBindingTargets(
                    root.querySelector("#first")!,
                    root.querySelector("#last")!,
                    ["first", "middle", "escaped"].map(targetNodeId => ({
                        targetNodeId,
                    })),
                );

                return {
                    targets: Object.values(targets).map(node => (node as Element).id),
                    afterMarker: root.querySelector("#after")!.getAttribute("data-fe"),
                };
            }

            return {
                legacy: {
                    remove: walkLegacy("remove"),
                    move: walkLegacy("move"),
                },
                remove: build("remove"),
                move: build("move"),
            };
        });

        expect(result).toEqual({
            legacy: {
                remove: ["first", "middle"],
                move: ["first", "middle"],
            },
            remove: {
                targets: ["first", "middle"],
                afterMarker: "1",
            },
            move: {
                targets: ["first", "middle"],
                afterMarker: "1",
            },
        });
    });

    test("matches the legacy walker when marker removal reparents the current node", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class CurrentNodeReparenter extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const root = this.parentElement!.parentElement!;
                    const after = root.querySelector("#after2")!;
                    after.parentElement!.insertBefore(this, after);
                }
            }

            customElements.define("current-node-reparenter", CurrentNodeReparenter);

            function createRoot() {
                const root = document.createElement("div");
                root.innerHTML = `
                    <section>
                        <div id="first" data-fe="1"></div>
                        <current-node-reparenter
                            id="mover"
                            data-fe="1"
                        ></current-node-reparenter>
                        <div id="last"></div>
                    </section>
                    <section>
                        <div id="after2" data-fe="1"></div>
                    </section>
                `;
                return root;
            }

            function walkLegacy() {
                const root = createRoot();
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);

                while (node !== null) {
                    const element = node as Element;
                    if (element.hasAttribute("data-fe")) {
                        visited.push(element.id);
                    }
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }

                range.detach();
                return visited;
            }

            const root = createRoot();
            const { targets } = buildViewBindingTargets(
                root.querySelector("#first")!,
                root.querySelector("#last")!,
                ["first", "mover", "after2"].map(targetNodeId => ({
                    targetNodeId,
                })),
            );

            return {
                legacy: walkLegacy(),
                current: Object.values(targets).map(node => (node as Element).id),
                afterMarker: root.querySelector("#after2")!.getAttribute("data-fe"),
            };
        });

        expect(result).toEqual({
            legacy: ["first", "mover"],
            current: ["first", "mover"],
            afterMarker: "1",
        });
    });

    test("matches the legacy walker when marker removal reparents the current ancestor", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class CurrentAncestorReparenter extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const ancestor = this.parentElement!;
                    const root = ancestor.parentElement!.parentElement!;
                    root.querySelector("#outside")!.append(ancestor);
                }
            }

            customElements.define(
                "current-ancestor-reparenter",
                CurrentAncestorReparenter,
            );

            function createRoot() {
                const root = document.createElement("div");
                root.innerHTML = `
                    <section>
                        <div id="first" data-fe="1"></div>
                        <div>
                            <current-ancestor-reparenter
                                id="mover"
                                data-fe="1"
                            ></current-ancestor-reparenter>
                            <div id="after2" data-fe="1"></div>
                        </div>
                        <div id="last"></div>
                    </section>
                    <section id="outside"></section>
                `;
                return root;
            }

            function walkLegacy() {
                const root = createRoot();
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);

                while (node !== null) {
                    const element = node as Element;
                    if (element.hasAttribute("data-fe")) {
                        visited.push(element.id);
                    }
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }

                range.detach();
                return visited;
            }

            const root = createRoot();
            const { targets } = buildViewBindingTargets(
                root.querySelector("#first")!,
                root.querySelector("#last")!,
                ["first", "mover", "after2"].map(targetNodeId => ({
                    targetNodeId,
                })),
            );

            return {
                legacy: walkLegacy(),
                current: Object.values(targets).map(node => (node as Element).id),
                afterMarker: root.querySelector("#after2")!.getAttribute("data-fe"),
            };
        });

        expect(result).toEqual({
            legacy: ["first", "mover"],
            current: ["first", "mover"],
            afterMarker: "1",
        });
    });

    test("matches a live Range when the exclusive stop is synchronously removed or moved", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class ExclusiveStopMutator extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const stop = this.parentElement!.querySelector(
                        "[data-exclusive-stop]",
                    );

                    if (this.dataset.mutation === "remove") {
                        stop!.remove();
                    } else {
                        this.parentElement!.append(stop!);
                    }
                }
            }

            customElements.define("exclusive-stop-mutator", ExclusiveStopMutator);

            function createRoot(mutation: "remove" | "move") {
                const root = document.createElement("div");
                root.innerHTML = `
                    <exclusive-stop-mutator
                        id="first"
                        data-fe="1"
                        data-mutation="${mutation}"
                    ></exclusive-stop-mutator>
                    <span id="middle" data-fe="1"></span>
                    <i id="last" data-fe="1">
                        <u id="last-child" data-fe="1"></u>
                    </i>
                    <b id="exclusive-stop" data-exclusive-stop></b>
                    <em id="escaped" data-fe="1"></em>
                `;
                return root;
            }

            function createSiblingRoot(mutation: "remove" | "move") {
                const root = document.createElement("div");
                root.innerHTML = `
                    <exclusive-stop-mutator
                        id="first"
                        data-fe="1"
                        data-mutation="${mutation}"
                    ></exclusive-stop-mutator>
                    <!--fe:e-->
                    <span id="last"></span>
                    <b data-exclusive-stop></b>
                    <em id="escaped" data-fe="1"></em>
                    <!--fe:/e-->
                `;
                return root;
            }

            function walkLegacy(mutation: "remove" | "move") {
                const root = createRoot(mutation);
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);
                while (node !== null) {
                    const element = node as Element;
                    visited.push(element.id);
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }
                range.detach();
                return visited;
            }

            function build(mutation: "remove" | "move") {
                const root = createRoot(mutation);
                const { targets } = buildViewBindingTargets(
                    root.querySelector("#first")!,
                    root.querySelector("#last")!,
                    ["first", "middle", "last", "lastChild", "escaped"].map(
                        targetNodeId => ({ targetNodeId }),
                    ),
                );

                return {
                    targets: Object.values(targets).map(node => (node as Element).id),
                    escapedMarker: root
                        .querySelector("#escaped")!
                        .getAttribute("data-fe"),
                };
            }

            function walkLegacySibling(mutation: "remove" | "move") {
                const root = createSiblingRoot(mutation);
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                walker.currentNode = first;
                first.removeAttribute("data-fe");
                walker.nextNode();
                const sibling = walker.nextSibling();
                const escaped = walker.nextSibling();
                range.detach();

                return {
                    sibling: (sibling as Element).id,
                    escaped: escaped === null ? null : (escaped as Element).id,
                };
            }

            function buildSibling(mutation: "remove" | "move") {
                const root = createSiblingRoot(mutation);

                try {
                    buildViewBindingTargets(
                        root.querySelector("#first")!,
                        root.querySelector("#last")!,
                        [{ targetNodeId: "first" }],
                    );
                    return false;
                } catch {
                    return true;
                }
            }

            return {
                remove: {
                    legacy: walkLegacy("remove"),
                    current: build("remove"),
                    siblingLegacy: walkLegacySibling("remove"),
                    siblingThrew: buildSibling("remove"),
                },
                move: {
                    legacy: walkLegacy("move"),
                    current: build("move"),
                    siblingLegacy: walkLegacySibling("move"),
                    siblingThrew: buildSibling("move"),
                },
            };
        });

        expect(result).toEqual({
            remove: {
                legacy: ["first", "middle", "last", "last-child"],
                current: {
                    targets: ["first", "middle", "last", "last-child"],
                    escapedMarker: "1",
                },
                siblingLegacy: {
                    sibling: "last",
                    escaped: null,
                },
                siblingThrew: true,
            },
            move: {
                legacy: ["first", "middle", "last", "last-child"],
                current: {
                    targets: ["first", "middle", "last", "last-child"],
                    escapedMarker: "1",
                },
                siblingLegacy: {
                    sibling: "last",
                    escaped: null,
                },
                siblingThrew: true,
            },
        });
    });

    test("uses the live Range when the exclusive stop moves before the endpoint", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class StopBeforeEndpointMutator extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const root = this.parentElement!;
                    root.insertBefore(
                        root.querySelector("[data-exclusive-stop]")!,
                        root.querySelector("#middle")!,
                    );
                }
            }

            customElements.define(
                "stop-before-endpoint-mutator",
                StopBeforeEndpointMutator,
            );

            function createRoot() {
                const root = document.createElement("div");
                const first = document.createElement("stop-before-endpoint-mutator");
                first.id = "first";
                first.setAttribute("data-fe", "1");
                const middle = document.createElement("span");
                middle.id = "middle";
                middle.setAttribute("data-fe", "1");
                const last = document.createElement("i");
                last.id = "last";
                last.setAttribute("data-fe", "1");
                const stop = document.createElement("b");
                stop.id = "stop";
                stop.setAttribute("data-fe", "1");
                stop.setAttribute("data-exclusive-stop", "");
                root.append(first, middle, last, stop);
                return { root, first, last };
            }

            function walkLegacy() {
                const { first, last } = createRoot();
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);

                while (node !== null) {
                    const element = node as Element;
                    visited.push(element.id);
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }

                range.detach();
                return visited;
            }

            const { root, first, last } = createRoot();
            const { targets } = buildViewBindingTargets(
                first,
                last,
                ["first", "stop", "middle", "last"].map(targetNodeId => ({
                    targetNodeId,
                })),
            );

            return {
                legacy: walkLegacy(),
                current: Object.values(targets).map(node => (node as Element).id),
                order: Array.from(root.children).map(node => node.id),
            };
        });

        expect(result).toEqual({
            legacy: ["first", "stop", "middle", "last"],
            current: ["first", "stop", "middle", "last"],
            order: ["first", "stop", "middle", "last"],
        });
    });

    test("uses the live Range when the exclusive stop moves into content", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class StopIntoContentMutator extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    this.parentElement!.querySelector("#content")!.append(
                        this.parentElement!.querySelector("[data-exclusive-stop]")!,
                    );
                }
            }

            customElements.define("stop-into-content-mutator", StopIntoContentMutator);

            function createRoot() {
                const root = document.createElement("div");
                const first = document.createElement("stop-into-content-mutator");
                first.id = "first";
                first.setAttribute("data-fe", "1");
                const start = document.createComment("fe:b");
                const content = document.createElement("div");
                content.id = "content";
                const end = document.createComment("fe:/b");
                const last = document.createElement("i");
                last.id = "last";
                const stop = document.createElement("b");
                stop.id = "stop";
                stop.setAttribute("data-exclusive-stop", "");
                root.append(first, start, content, end, last, stop);
                return { root, first, start, content, end, last, stop };
            }

            function walkLegacy() {
                const { first, start, end, last } = createRoot();
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                walker.currentNode = first;
                first.removeAttribute("data-fe");

                const foundStart = walker.nextSibling() === start;
                let current = walker.nextSibling();

                while (current !== null && current !== end) {
                    current = walker.nextSibling();
                }

                range.detach();
                return {
                    foundStart,
                    foundEnd: current === end,
                };
            }

            const { first, content, end, last, stop } = createRoot();
            const { targets, boundaries } = buildViewBindingTargets(first, last, [
                { targetNodeId: "first" },
                { targetNodeId: "content" },
            ]);

            return {
                legacy: walkLegacy(),
                current: {
                    first: (targets.first as Element).id,
                    foundEnd: end.data === "",
                    boundaryFirst: (boundaries.content.first as Element).id,
                    boundaryLast: (boundaries.content.last as Element).id,
                    stopParent: (stop.parentNode as Element).id,
                    contentChild: content.firstElementChild!.id,
                },
            };
        });

        expect(result).toEqual({
            legacy: {
                foundStart: true,
                foundEnd: true,
            },
            current: {
                first: "first",
                foundEnd: true,
                boundaryFirst: "content",
                boundaryLast: "content",
                stopParent: "content",
                contentChild: "stop",
            },
        });
    });

    test("stops sibling traversal when a returned container contains the boundary", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            function createRoot() {
                const root = document.createElement("div");
                const start = document.createComment("fe:b");
                const container = document.createElement("div");
                container.id = "container";
                container.innerHTML = `
                    <span id="last"></span>
                    <i id="exclusive-stop"></i>
                `;
                const end = document.createComment("fe:/b");
                root.append(start, container, end);
                return { root, start, container, end };
            }

            const legacyRoot = createRoot();
            const legacyLast = legacyRoot.root.querySelector("#last")!;
            const range = document.createRange();
            range.setStart(legacyRoot.start, 0);
            range.setEnd(legacyLast, legacyLast.childNodes.length);
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT,
                {
                    acceptNode(node) {
                        return range.comparePoint(node, 0) === 0
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    },
                },
            );
            walker.currentNode = legacyRoot.start;
            const legacyContainer = walker.nextSibling();
            const legacyEscaped = walker.nextSibling();
            range.detach();

            const currentRoot = createRoot();
            let currentError: Error | null = null;

            try {
                buildViewBindingTargets(
                    currentRoot.start,
                    currentRoot.root.querySelector("#last")!,
                    [{ targetNodeId: "content" }],
                );
            } catch (error) {
                currentError = error as Error;
            }

            return {
                legacyContainer: (legacyContainer as Element).id,
                legacyEscaped:
                    legacyEscaped === null ? null : (legacyEscaped as Element).id,
                currentThrew: currentError !== null,
                currentMessage: currentError?.message,
                endData: currentRoot.end.data,
            };
        });

        expect(result).toMatchObject({
            legacyContainer: "container",
            legacyEscaped: null,
            currentThrew: true,
            endData: "fe:/b",
        });
        expect(result.currentMessage).toContain(
            "matching `<!--fe:/b-->` content binding close marker",
        );
    });

    test("uses the live Range after endpoint removal without visiting an appended marker", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            class FinalEndpointMutator extends HTMLElement {
                static observedAttributes = ["data-fe"];

                attributeChangedCallback(
                    _name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (oldValue === null || newValue !== null) {
                        return;
                    }

                    const endpoint =
                        this.parentElement!.querySelector("[data-endpoint]")!;
                    endpoint.remove();

                    const appended = document.createElement("b");
                    appended.id = "appended";
                    appended.setAttribute("data-fe", "1");
                    this.parentElement!.append(appended);
                }
            }

            customElements.define("final-endpoint-mutator", FinalEndpointMutator);

            function createRoot() {
                const root = document.createElement("div");
                root.innerHTML = `
                    <final-endpoint-mutator
                        id="first"
                        data-fe="1"
                    ></final-endpoint-mutator>
                    <span id="middle" data-fe="1"></span>
                    <i id="last" data-endpoint></i>
                `;
                return root;
            }

            function walkLegacy() {
                const root = createRoot();
                const first = root.querySelector("#first")!;
                const last = root.querySelector("#last")!;
                const range = document.createRange();
                range.setStart(first, 0);
                range.setEnd(last, last.childNodes.length);
                const walker = document.createTreeWalker(
                    range.commonAncestorContainer,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(node) {
                            return range.comparePoint(node, 0) === 0
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        },
                    },
                );
                const visited: string[] = [];
                let node: Node | null = (walker.currentNode = first);

                while (node !== null) {
                    const element = node as Element;
                    visited.push(element.id);
                    element.removeAttribute("data-fe");
                    node = walker.nextNode();
                }

                range.detach();
                return {
                    visited,
                    appendedMarker: root
                        .querySelector("#appended")!
                        .getAttribute("data-fe"),
                };
            }

            const root = createRoot();
            const originalComparePoint = Range.prototype.comparePoint;
            let comparePointCalls = 0;
            let targets: Record<string, Node>;

            try {
                Range.prototype.comparePoint = function (
                    node: Node,
                    offset: number,
                ): number {
                    comparePointCalls++;
                    return originalComparePoint.call(this, node, offset);
                };
                ({ targets } = buildViewBindingTargets(
                    root.querySelector("#first")!,
                    root.querySelector("#last")!,
                    ["first", "middle"].map(targetNodeId => ({ targetNodeId })),
                ));
            } finally {
                Range.prototype.comparePoint = originalComparePoint;
            }

            return {
                legacy: walkLegacy(),
                current: {
                    targets: Object.values(targets!).map(node => (node as Element).id),
                    appendedMarker: root
                        .querySelector("#appended")!
                        .getAttribute("data-fe"),
                    comparePointCalls,
                },
            };
        });

        expect(result.legacy).toEqual({
            visited: ["first", "middle"],
            appendedMarker: "1",
        });
        expect(result.current).toMatchObject({
            targets: ["first", "middle"],
            appendedMarker: "1",
        });
        expect(result.current.comparePointCalls).toBeGreaterThan(0);
        expect(result.current.comparePointCalls).toBeLessThanOrEqual(5);
    });

    test("supports ordered endpoints in detached fragments and shadow roots", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const fragment = document.createDocumentFragment();
            const fragmentFirst = document.createElement("span");
            fragmentFirst.id = "fragment-first";
            fragmentFirst.setAttribute("data-fe", "1");
            const fragmentLast = document.createElement("div");
            fragmentLast.id = "fragment-last";
            fragmentLast.setAttribute("data-fe", "1");
            fragmentLast.innerHTML = `<i id="fragment-child" data-fe="1"></i>`;
            const fragmentAfter = document.createElement("b");
            fragmentAfter.setAttribute("data-fe", "1");
            fragment.append(fragmentFirst, fragmentLast, fragmentAfter);

            const fragmentTargets = buildViewBindingTargets(
                fragmentFirst,
                fragmentLast,
                ["first", "last", "child"].map(targetNodeId => ({ targetNodeId })),
            ).targets;

            const host = document.createElement("div");
            const shadowRoot = host.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = `
                <span id="shadow-first" data-fe="1"></span>
                <div id="shadow-last" data-fe="1"><i id="shadow-child" data-fe="1"></i></div>
                <b id="shadow-after" data-fe="1"></b>
            `;
            const shadowTargets = buildViewBindingTargets(
                shadowRoot.querySelector("#shadow-first")!,
                shadowRoot.querySelector("#shadow-last")!,
                ["first", "last", "child"].map(targetNodeId => ({ targetNodeId })),
            ).targets;

            return {
                fragment: Object.values(fragmentTargets).map(
                    node => (node as Element).id,
                ),
                fragmentAfterMarker: fragmentAfter.getAttribute("data-fe"),
                shadow: Object.values(shadowTargets).map(node => (node as Element).id),
                shadowAfterMarker: shadowRoot
                    .querySelector("#shadow-after")!
                    .getAttribute("data-fe"),
            };
        });

        expect(result).toEqual({
            fragment: ["fragment-first", "fragment-last", "fragment-child"],
            fragmentAfterMarker: "1",
            shadow: ["shadow-first", "shadow-last", "shadow-child"],
            shadowAfterMarker: "1",
        });
    });

    test("terminates at the end of detached fragments and shadow roots", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            function build(root: DocumentFragment | ShadowRoot) {
                const first = document.createElement("span");
                first.id = "first";
                first.setAttribute("data-fe", "1");
                const last = document.createElement("div");
                last.id = "last";
                last.setAttribute("data-fe", "1");
                root.append(first, last);

                return Object.values(
                    buildViewBindingTargets(first, last, [
                        { targetNodeId: "first" },
                        { targetNodeId: "last" },
                    ]).targets,
                ).map(node => (node as Element).id);
            }

            const fragment = build(document.createDocumentFragment());
            const shadow = build(
                document.createElement("div").attachShadow({ mode: "open" }),
            );

            return { fragment, shadow };
        });

        expect(result).toEqual({
            fragment: ["first", "last"],
            shadow: ["first", "last"],
        });
    });

    test("supports a last endpoint nested within the first endpoint", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const first = document.createElement("div");
            first.id = "first";
            first.setAttribute("data-fe", "1");
            first.innerHTML =
                `<span id="before" data-fe="1"></span>` +
                `<section><div id="last" data-fe="1">` +
                `<i id="last-child" data-fe="1"></i></div>` +
                `<b id="after" data-fe="1"></b></section>`;
            const last = first.querySelector("#last")!;

            const { targets } = buildViewBindingTargets(
                first,
                last,
                ["first", "before", "last", "lastChild"].map(targetNodeId => ({
                    targetNodeId,
                })),
            );

            return {
                targets: Object.values(targets).map(node => (node as Element).id),
                afterMarker: first.querySelector("#after")!.getAttribute("data-fe"),
            };
        });

        expect(result).toEqual({
            targets: ["first", "before", "last", "last-child"],
            afterMarker: "1",
        });
    });

    test("preserves empty, single-text, and multi-node content targets", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            function build(markup: string) {
                const root = document.createElement("div");
                root.innerHTML = markup;
                const first = root.firstChild!;
                const last = root.lastChild!;
                const { targets, boundaries } = buildViewBindingTargets(first, last, [
                    { targetNodeId: "content" },
                ]);
                const boundary = boundaries.content;

                return {
                    childNodes: Array.from(root.childNodes).map(node => ({
                        type: node.nodeType,
                        text: node.textContent,
                    })),
                    targetType: targets.content.nodeType,
                    targetText: targets.content.textContent,
                    boundary:
                        boundary === undefined
                            ? null
                            : [boundary.first.textContent, boundary.last.textContent],
                };
            }

            return {
                empty: build(`<!--fe:b--><!--fe:/b-->`),
                single: build(`<!--fe:b-->single<!--fe:/b-->`),
                multi: build(`<!--fe:b--><span>first</span><em>last</em><!--fe:/b-->`),
            };
        });

        expect(result.empty).toEqual({
            childNodes: [
                { type: 8, text: "" },
                { type: 3, text: "" },
                { type: 8, text: "" },
            ],
            targetType: 3,
            targetText: "",
            boundary: null,
        });
        expect(result.single).toEqual({
            childNodes: [
                { type: 8, text: "" },
                { type: 3, text: "single" },
                { type: 8, text: "" },
            ],
            targetType: 3,
            targetText: "single",
            boundary: null,
        });
        expect(result.multi).toEqual({
            childNodes: [
                { type: 8, text: "" },
                { type: 1, text: "first" },
                { type: 1, text: "last" },
                { type: 3, text: "" },
                { type: 8, text: "" },
            ],
            targetType: 3,
            targetText: "",
            boundary: ["first", "last"],
        });
    });

    test("keeps nested content markers balanced and resumes after the outer range", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const root = document.createElement("div");
            root.innerHTML =
                `<!--fe:b--><span id="first">first</span>` +
                `<!--fe:b--><!--fe:b-->deep<!--fe:/b--><!--fe:/b-->` +
                `<em id="last">last</em><!--fe:/b-->` +
                `<div id="after" data-fe="1"></div>`;

            const { targets, boundaries } = buildViewBindingTargets(
                root.firstChild!,
                root.lastChild!,
                [{ targetNodeId: "outer" }, { targetNodeId: "after" }],
            );

            return {
                after: (targets.after as Element).id,
                outerType: targets.outer.nodeType,
                boundary: [
                    (boundaries.outer.first as Element).id,
                    (boundaries.outer.last as Element).id,
                ],
                nestedMarkers: Array.from(root.childNodes)
                    .filter(node => node.nodeType === Node.COMMENT_NODE)
                    .map(node => (node as Comment).data)
                    .filter(data => data !== ""),
            };
        });

        expect(result).toEqual({
            after: "after",
            outerType: 3,
            boundary: ["first", "last"],
            nestedMarkers: ["fe:b", "fe:b", "fe:/b", "fe:/b"],
        });
    });

    test("skips balanced custom-element boundaries without consuming nested targets", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const root = document.createElement("div");
            root.innerHTML =
                `<!--fe:e--><div id="nested-target" data-fe="1"></div>` +
                `<!--fe:e--><span id="deep-target" data-fe="1"></span><!--fe:/e-->` +
                `<!--fe:/e--><div id="parent-target" data-fe="1"></div>`;

            const { targets } = buildViewBindingTargets(
                root.firstChild!,
                root.lastChild!,
                [{ targetNodeId: "parent" }],
            );

            return {
                parent: (targets.parent as Element).id,
                nestedMarker: root
                    .querySelector("#nested-target")!
                    .getAttribute("data-fe"),
                deepMarker: root.querySelector("#deep-target")!.getAttribute("data-fe"),
                boundaryData: Array.from(root.childNodes)
                    .filter(node => node.nodeType === Node.COMMENT_NODE)
                    .map(node => (node as Comment).data),
            };
        });

        expect(result).toEqual({
            parent: "parent-target",
            nestedMarker: "1",
            deepMarker: "1",
            boundaryData: ["", "", "", ""],
        });
    });

    test("preserves current and representative legacy marker targeting", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            const {
                buildViewBindingTargets,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            const root = document.createElement("div");
            root.innerHTML =
                `<div id="current" data-fe="1"></div>` +
                `<div id="legacy" data-fe-c-1-2></div>` +
                `<!--fe-b$$start$$3$$content$$fe-b-->legacy content` +
                `<!--fe-b$$end$$3$$content$$fe-b-->`;

            const { targets } = buildViewBindingTargets(
                root.firstChild!,
                root.lastChild!,
                ["current", "legacyOne", "legacyTwo", "content"].map(targetNodeId => ({
                    targetNodeId,
                })),
            );

            return {
                targets: Object.fromEntries(
                    Object.entries(targets).map(([key, node]) => [
                        key,
                        node.nodeType === Node.ELEMENT_NODE
                            ? (node as Element).id
                            : node.textContent,
                    ]),
                ),
                currentMarker: root.querySelector("#current")!.getAttribute("data-fe"),
                legacyMarkers: root
                    .querySelector("#legacy")!
                    .getAttributeNames()
                    .filter(name => name.startsWith("data-fe")),
            };
        });

        expect(result).toEqual({
            targets: {
                current: "current",
                legacyOne: "legacy",
                legacyTwo: "legacy",
                content: "legacy content",
            },
            currentMarker: null,
            legacyMarkers: [],
        });
    });
});
