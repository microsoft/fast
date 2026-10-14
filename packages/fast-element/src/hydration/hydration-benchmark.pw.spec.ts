import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
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
