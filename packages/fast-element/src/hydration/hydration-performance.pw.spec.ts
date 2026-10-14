import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("sibling views avoid traversal setup and native factory-index arrays", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { buildViewBindingTargets } = await import("/main.js");
        const roots = Array.from({ length: 500 }, () => {
            const root = document.createElement("div");
            root.innerHTML =
                '<span data-fe=" 0002 "><!--fe:b--><!--fe:/b--></span><i data-fe="1"><b data-fe="1"></b></i><u data-fe="1"></u>';
            root.firstChild!.insertBefore(
                document.createProcessingInstruction("ignored", ""),
                root.firstChild!.firstChild,
            );
            return root;
        });
        const originalRange = document.createRange;
        const originalWalker = document.createTreeWalker;
        const originalFrom = Array.from;
        let ranges = 0;
        let walkers = 0;
        let indexArrays = 0;
        let preserved = 0;
        try {
            document.createRange = function () {
                ranges++;
                return originalRange.call(this);
            };
            document.createTreeWalker = function (...args) {
                walkers++;
                return originalWalker.apply(this, args);
            };
            Object.defineProperty(Array, "from", {
                value: function (...args: unknown[]) {
                    if (
                        typeof args[0] === "object" &&
                        args[0] !== null &&
                        "length" in args[0] &&
                        !Array.isArray(args[0])
                    )
                        indexArrays++;
                    return Reflect.apply(originalFrom, Array, args);
                },
            });
            for (const [index, root] of roots.entries()) {
                const first = root.firstChild!;
                const single = index % 2 === 0;
                const last = single ? first : root.childNodes[1];
                const ids = single
                    ? ["h", "one", "two", "content"]
                    : ["h", "one", "two", "content", "last", "child"];
                const { targets } = buildViewBindingTargets(
                    first,
                    last,
                    ids.map(targetNodeId => ({
                        targetNodeId,
                    })),
                );
                if (
                    targets.one === first &&
                    targets.two === first &&
                    (single
                        ? !("last" in targets)
                        : targets.last === last && targets.child === last.firstChild)
                )
                    preserved++;
                if (
                    targets.content.nodeType !== Node.TEXT_NODE ||
                    targets.content.textContent !== ""
                )
                    throw new Error("Empty content target lost");
            }
        } finally {
            document.createRange = originalRange;
            document.createTreeWalker = originalWalker;
            Array.from = originalFrom;
        }
        return {
            ranges,
            walkers,
            indexArrays,
            preserved,
            outside: roots.every(
                root => root.lastElementChild!.getAttribute("data-fe") === "1",
            ),
        };
    });
    expect(result).toEqual({
        ranges: 0,
        walkers: 0,
        indexArrays: 0,
        preserved: 500,
        outside: true,
    });
});

test("rejects invalid counts and preserves structural content diagnostics", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            buildViewBindingTargets,
            hydrationDebugger,
            enableHydration,
            HydrationMarkup,
        } = await import("/main.js");
        enableHydration({ debugger: hydrationDebugger() });
        const failures = [];
        for (const count of ["0", "-1", "1.5", "", "no", "4294967296"]) {
            const root = document.createElement("div");
            root.setAttribute("data-fe", count);
            let expected;
            try {
                HydrationMarkup.resolveAttributeBindings(root, 0, 0);
            } catch (error) {
                expected = {
                    name: (error as Error).name,
                    message: (error as Error).message,
                };
            }
            try {
                buildViewBindingTargets(root, root, [{ targetNodeId: "one" }]);
            } catch (error) {
                failures.push({
                    expected,
                    actual: {
                        name: (error as Error).name,
                        message: (error as Error).message,
                    },
                    marker: root.getAttribute("data-fe"),
                    count,
                });
            }
        }
        const contentErrors = [];
        for (const markup of [
            "<!--fe:b-->",
            "<!--fe:b--><span></span>",
            "<!--fe:b--><!--fe:b--><!--fe:/b-->",
            "<!--fe:e--><span></span>",
            "<!--fe:e--><!--fe:e--><!--fe:/e-->",
        ]) {
            const root = document.createElement("div");
            root.innerHTML = markup;
            try {
                buildViewBindingTargets(root.firstChild!, root.lastChild!, [
                    { targetNodeId: "one" },
                ]);
            } catch (error) {
                contentErrors.push({
                    name: (error as Error).constructor.name,
                    message: (error as Error).message,
                });
            }
        }
        return { failures, contentErrors };
    });
    expect(result.failures).toHaveLength(6);
    for (const failure of result.failures) {
        expect(failure.actual).toEqual(failure.expected);
        expect(failure.marker).toBe(failure.count);
    }
    expect(result.contentErrors).toHaveLength(5);
    for (const error of result.contentErrors) {
        expect(error.name).toBe("HydrationTargetElementError");
        expect(error.message).toContain("Hydration mismatch");
    }
});

test("repeat discovery rejects an unmatched start even when the client list is empty", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { html, repeat, enableHydration } = await import("/main.js");
        enableHydration();
        const root = document.createElement("div");
        root.innerHTML = "<!--fe:b--><!--fe:r--><i></i><!--fe:/b-->";
        const template = html`${repeat((x: { items: string[] }) => x.items, html`<i></i>`)}`;
        try {
            template.hydrate(root.firstChild!, root.lastChild!).bind({ items: [] });
            return null;
        } catch (error) {
            return (error as Error).message;
        }
    });
    expect(result).toContain("repeat end marker not found");
});

test("repeat ranges retain identity and reconcile empty, missing and excess items", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { html, repeat, enableHydration } = await import("/main.js");
        enableHydration();
        function hydrate(serverCount: number, clientCount: number, empty = false) {
            const root = document.createElement("div");
            root.innerHTML = `<!--fe:b-->${Array.from(
                { length: serverCount },
                (_, index) =>
                    `<!--fe:r-->${empty ? "" : `<i data-server="${index}"></i>`}<!--fe:/r-->`,
            ).join("")}<!--fe:/b-->`;
            const original = Array.from(root.querySelectorAll("i"));
            const template = html`${repeat((x: { items: string[] }) => x.items, empty ? html`` : html`<i></i>`)}`;
            template
                .hydrate(root.firstChild!, root.lastChild!)
                .bind({ items: Array.from({ length: clientCount }, () => "") });
            return {
                count: root.querySelectorAll("i").length,
                identity: original
                    .slice(0, Math.min(serverCount, clientCount))
                    .every((node, index) => root.querySelectorAll("i")[index] === node),
            };
        }
        return {
            missing: hydrate(2, 4),
            excess: hydrate(4, 2),
            none: hydrate(3, 0),
            empty: hydrate(3, 3, true),
        };
    });
    expect(result).toEqual({
        missing: { count: 4, identity: true },
        excess: { count: 2, identity: true },
        none: { count: 0, identity: true },
        empty: { count: 0, identity: true },
    });
});

test("repeat marker visits are linear, bounded and leave nested ranges for child views", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            html,
            repeat,
            enableHydration,
            createHydrationMarkers,
            HydrationMarkup,
            HTMLView,
        } = await import("/main.js");
        return [20, 200].map(count => {
            let startVisits = 0;
            let endVisits = 0;
            const markers = createHydrationMarkers({
                ...HydrationMarkup,
                isRepeatViewStartMarker(data: string) {
                    startVisits++;
                    return data === "fe:r";
                },
                isRepeatViewEndMarker(data: string) {
                    endVisits++;
                    return data === "fe:/r";
                },
            });
            enableHydration({ markers });
            const root = document.createElement("div");
            root.innerHTML = `<!--fe:r--><u></u><!--fe:/r--><!--fe:b-->${"<!--fe:r--><i></i><!--fe:r--><!--fe:/r--><!--fe:/r-->".repeat(count)}<!--fe:/b-->`;
            const original = Array.from(root.querySelectorAll("i"));
            let nestedPreserved = 0;
            const item = html`<i></i>`;
            Object.defineProperty(item, "hydrate", {
                value(first: Node, last: Node) {
                    if (
                        first === original[nestedPreserved] &&
                        first.nextSibling!.textContent === "fe:r" &&
                        last.textContent === "fe:/r"
                    )
                        nestedPreserved++;
                    return new HTMLView(document.createDocumentFragment(), []);
                },
            });
            const template = html`${repeat((x: { items: number[] }) => x.items, item)}`;
            const view = template.hydrate(root.childNodes[3], root.lastChild!);
            view.bind({ items: Array.from({ length: count }, (_, index) => index) });
            view.unbind();
            return {
                count,
                startVisits,
                endVisits,
                nestedPreserved,
                prefix: root.firstChild!.textContent,
            };
        });
    });
    for (const item of result)
        expect(item).toEqual({
            count: item.count,
            startVisits: 4 * item.count,
            endVisits: 2 * item.count,
            nestedPreserved: item.count,
            prefix: "fe:r",
        });
});

test("installed markers_v2 hydrates repeat attributes and content without replacing nodes", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { html, repeat, enableHydration, markers_v2 } = await import("/main.js");
        enableHydration({ markers: markers_v2 });
        const root = document.createElement("div");
        root.innerHTML = `<!--fe-b$$start$$0$$outer$$fe-b-->${["A", "B"]
            .map(
                (value, index) =>
                    `<!--fe-repeat$$start$$${index}$$fe-repeat--><i title="${value}" data-fe-b="0"><!--fe-b$$start$$1$$item$$fe-b-->${value}<!--fe-b$$end$$1$$item$$fe-b--></i><!--fe-repeat$$end$$${index}$$fe-repeat-->`,
            )
            .join("")}<!--fe-b$$end$$0$$outer$$fe-b-->`;
        const original = Array.from(root.querySelectorAll("i"));
        const item = html`<i title=${(x: string) => x}>${(x: string) => x}</i>`;
        const template = html`${repeat((x: { items: string[] }) => x.items, item)}`;
        template.hydrate(root.firstChild!, root.lastChild!).bind({ items: ["A", "B"] });
        return {
            identity: original.every(
                (node, index) => root.querySelectorAll("i")[index] === node,
            ),
            text: original.map(node => node.textContent),
            markers: root.querySelectorAll("[data-fe-b]").length,
        };
    });
    expect(result).toEqual({ identity: true, text: ["A", "B"], markers: 0 });
});

test("malformed repeat discovery reports the host and does not clear partial pairs", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { html, repeat, enableHydration } = await import("/main.js");
        enableHydration();
        return [
            "<!--fe:r--><i></i>",
            "<i></i><!--fe:/r-->",
            "<!--fe:r--><!--fe:r--><!--fe:/r-->",
        ].map(markup => {
            const host = document.createElement("malformed-repeat");
            const root = host.attachShadow({ mode: "open" });
            root.innerHTML = `<!--fe:b-->${markup}<!--fe:/b-->`;
            const template = html`${repeat((x: { items: string[] }) => x.items, html`<i></i>`)}`;
            try {
                template.hydrate(root.firstChild!, root.lastChild!).bind({ items: [] });
            } catch (error) {
                return {
                    message: (error as Error).message,
                    intact: root.innerHTML.includes(markup),
                };
            }
            throw new Error("Malformed repeat was accepted");
        });
    });
    expect(result.map(item => item.intact)).toEqual([true, true, true]);
    expect(result[0].message).toBe(
        'Error when hydrating inside "MALFORMED-REPEAT": repeat end marker not found.',
    );
    expect(result[1].message).toBe(
        'Error when hydrating inside "MALFORMED-REPEAT": repeat start marker not found.',
    );
    expect(result[2].message).toBe(result[0].message);
});

test("measures independent traversal, native-marker, repeat and combined workloads", async ({
    page,
}) => {
    test.skip(
        !process.env.FAST_HYDRATION_BENCHMARK,
        "Opt-in same-machine CPU benchmark.",
    );
    test.setTimeout(180_000);
    const samples: Record<string, number[]> = {
        traversal: [],
        nativeMarkers: [],
        repeatPairing: [],
        adjacentRepeats: [],
        combined: [],
    };
    for (const workload of Object.keys(samples)) {
        for (let run = 0; run < 11; run++) {
            // A fresh document prevents old live Ranges from affecting later DOM mutations.
            await page.goto("/");
            const duration = await page.evaluate(async workload => {
                // @ts-expect-error: Client module.
                const {
                    buildViewBindingTargets,
                    html,
                    repeat,
                    enableHydration,
                    HTMLView,
                    when,
                } = await import("/main.js");
                enableHydration();
                function measure(setup: () => () => void | (() => void)) {
                    const work = setup();
                    const start = performance.now();
                    const verify = work();
                    const duration = performance.now() - start;
                    if (typeof verify === "function") verify();
                    return duration;
                }
                const traversal =
                    workload === "traversal"
                        ? measure(() => {
                              const roots = Array.from({ length: 4000 }, () => {
                                  const root = document.createElement("div");
                                  root.innerHTML = "<span><b></b></span><i></i>";
                                  return root;
                              });
                              return () => {
                                  for (const root of roots)
                                      buildViewBindingTargets(
                                          root.firstChild!,
                                          root.lastChild!,
                                          [],
                                      );
                              };
                          })
                        : null;
                const nativeMarkers =
                    workload === "nativeMarkers"
                        ? measure(() => {
                              const root = document.createElement("div");
                              root.innerHTML = Array.from(
                                  { length: 4000 },
                                  () =>
                                      '<span data-fe="2"><!--fe:b-->value<!--fe:/b--></span>',
                              ).join("");
                              const factories = Array.from(
                                  { length: 12000 },
                                  (_, index) => ({ targetNodeId: String(index) }),
                              );
                              return () => {
                                  buildViewBindingTargets(
                                      root.firstChild!,
                                      root.lastChild!,
                                      factories,
                                  );
                              };
                          })
                        : null;
                const repeatPairing =
                    workload === "repeatPairing"
                        ? measure(() => {
                              const root = document.createElement("div");
                              root.innerHTML = `<!--fe:b-->${"<!--fe:r--><i></i><!--fe:r--><!--fe:/r--><!--fe:/r-->".repeat(4000)}<!--fe:/b-->`;
                              const item = html`<i></i>`;
                              Object.defineProperty(item, "hydrate", {
                                  value: () =>
                                      new HTMLView(document.createDocumentFragment(), []),
                              });
                              const template = html`${repeat((x: { items: number[] }) => x.items, item)}`;
                              const view = template.hydrate(
                                  root.firstChild!,
                                  root.lastChild!,
                              );
                              const items = Array.from(
                                  { length: 4000 },
                                  (_, index) => index,
                              );
                              return () => {
                                  view.bind({ items });
                                  view.unbind();
                              };
                          })
                        : null;
                const adjacentRepeats =
                    workload === "adjacentRepeats"
                        ? measure(() => {
                              const root = document.createElement("div");
                              root.innerHTML = (
                                  "<!--fe:b-->" +
                                  "<!--fe:r--><i></i><!--fe:/r-->".repeat(200) +
                                  "<!--fe:/b-->"
                              ).repeat(20);
                              const original = Array.from(root.querySelectorAll("i"));
                              const item = html`<i></i>`;
                              Object.defineProperty(item, "hydrate", {
                                  value: () =>
                                      new HTMLView(document.createDocumentFragment(), []),
                              });
                              const strings = Object.assign(Array(21).fill(""), {
                                  raw: Array(21).fill(""),
                              });
                              const directives = Array.from({ length: 20 }, () =>
                                  repeat((x: { items: number[] }) => x.items, item),
                              );
                              const template = html(strings, ...directives);
                              const view = template.hydrate(
                                  root.firstChild!,
                                  root.lastChild!,
                              );
                              const items = Array.from(
                                  { length: 200 },
                                  (_, index) => index,
                              );
                              return () => {
                                  view.bind({ items });
                                  view.unbind();
                                  return () => {
                                      const nodes = root.querySelectorAll("i");
                                      if (
                                          nodes.length !== 4000 ||
                                          !original.every(
                                              (node, index) => nodes[index] === node,
                                          )
                                      ) {
                                          throw new Error(
                                              "Adjacent repeats changed SSR node identity",
                                          );
                                      }
                                  };
                              };
                          })
                        : null;
                const combined =
                    workload === "combined"
                        ? measure(() => {
                              const root = document.createElement("div");
                              customElements.define(
                                  "benchmark-record",
                                  class extends HTMLElement {},
                              );
                              customElements.define(
                                  "benchmark-child",
                                  class extends HTMLElement {},
                              );
                              const items = Array.from({ length: 1000 }, () => ({
                                  name: "record",
                                  children: [1, 2, 3].map(value => ({
                                      label: String(value),
                                      values: [value],
                                  })),
                              }));
                              const markup =
                                  '<!--fe:r--><benchmark-record title="record" data-fe="1"><!--fe:b--><!--fe:b-->' +
                                  [1, 2, 3]
                                      .map(
                                          value =>
                                              `<!--fe:r--><benchmark-child title="${value}" data-fe="1"><!--fe:b--><!--fe:r--><span><!--fe:b-->${value}<!--fe:/b--></span><!--fe:/r--><!--fe:/b--></benchmark-child><!--fe:/r-->`,
                                      )
                                      .join("") +
                                  "<!--fe:/b--><!--fe:/b--></benchmark-record><!--fe:/r-->";
                              root.innerHTML = `<!--fe:b-->${markup.repeat(1000)}<!--fe:/b-->`;
                              const leaf = html`<span>${(x: number) => x}</span>`;
                              const child = html`<benchmark-child title=${(x: { label: string }) => x.label}>${repeat((x: { values: number[] }) => x.values, leaf)}</benchmark-child>`;
                              const conditional = html`${repeat((x: { children: { label: string; values: number[] }[] }) => x.children, child)}`;
                              const item = html`<benchmark-record title=${(x: { name: string }) => x.name}>${when(() => true, conditional)}</benchmark-record>`;
                              const template = html`${repeat((x: { items: typeof items }) => x.items, item)}`;
                              let hydratedViews = 0;
                              for (const candidate of [
                                  leaf,
                                  child,
                                  conditional,
                                  item,
                                  template,
                              ]) {
                                  const hydrate = candidate.hydrate;
                                  Object.defineProperty(candidate, "hydrate", {
                                      value: (...args: Node[]) => {
                                          hydratedViews++;
                                          return hydrate.apply(candidate, args);
                                      },
                                  });
                              }
                              const original = Array.from(
                                  root.querySelectorAll(
                                      "benchmark-record, benchmark-child, span",
                                  ),
                              );
                              const view = template.hydrate(
                                  root.firstChild!,
                                  root.lastChild!,
                              );
                              return () => {
                                  view.bind({ items });
                                  view.unbind();
                                  return () => {
                                      const nodes = root.querySelectorAll(
                                          "benchmark-record, benchmark-child, span",
                                      );
                                      if (
                                          hydratedViews !== 8001 ||
                                          nodes.length !== 7000 ||
                                          !original.every(
                                              (node, index) => nodes[index] === node,
                                          )
                                      ) {
                                          throw new Error(
                                              `Combined workload mismatch: ${hydratedViews} hydrated views, ${nodes.length} SSR nodes, identity ${original.every((node, index) => nodes[index] === node)}`,
                                          );
                                      }
                                  };
                              };
                          })
                        : null;
                const duration = {
                    traversal,
                    nativeMarkers,
                    repeatPairing,
                    adjacentRepeats,
                    combined,
                }[workload];
                if (duration === undefined || duration === null)
                    throw new Error(`Unknown workload: ${workload}`);
                return duration;
            }, workload);
            if (run > 0) samples[workload].push(duration);
        }
    }
    const result = Object.fromEntries(
        Object.entries(samples).map(([workload, values]) => {
            values.sort((a, b) => a - b);
            return [
                workload,
                {
                    median: (values[4] + values[5]) / 2,
                    min: values[0],
                    max: values[9],
                    samples: values,
                },
            ];
        }),
    );
    for (const values of Object.values(samples)) expect(values).toHaveLength(10);
    console.log(`Hydration workload medians (ms): ${JSON.stringify(result)}`);
});
