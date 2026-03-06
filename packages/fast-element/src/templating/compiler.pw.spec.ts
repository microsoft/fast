import { expect, test } from "@playwright/test";

test.describe("The template compiler", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    const contentScenarioTypes = [
        "no",
        "an empty template",
        "a single",
        "a single starting",
        "a single middle",
        "a single ending",
        "back-to-back",
        "back-to-back starting",
        "back-to-back middle",
        "back-to-back ending",
        "separated",
        "separated starting",
        "separated middle",
        "separated ending",
        "mixed content",
    ];

    const policyNames = ["custom", "default"];

    test.describe("when compiling content", () => {
        for (let sIdx = 0; sIdx < contentScenarioTypes.length; sIdx++) {
            const sType = contentScenarioTypes[sIdx];

            test(`ensures that first and last child references are not null for ${sType}`, async ({
                page,
            }) => {
                const result = await page.evaluate(async (idx: number) => {
                    // @ts-expect-error: Client module.
                    const { Compiler, Markup, HTMLBindingDirective, oneWay } =
                        await import("/main.js");

                    const I = (n: number) => Markup.interpolation(`${n}`);
                    const B = (r = "result") => new HTMLBindingDirective(oneWay(() => r));
                    const compile = (h: string, dirs: any[], pol?: any) => {
                        const fac: any = Object.create(null);
                        let nid = -1;
                        const add = (f: any) => {
                            const id = `${++nid}`;
                            f.id = id;
                            fac[id] = f;
                            return id;
                        };
                        dirs.forEach((x: any) => x.createHTML(add));
                        return Compiler.compile(h, fac, pol) as any;
                    };

                    const scenarios = [
                        { html: ``, directives: () => [] as any[] },
                        {
                            html: `<template></template>`,
                            directives: () => [] as any[],
                        },
                        {
                            html: `${I(0)}`,
                            directives: () => [B()],
                        },
                        {
                            html: `${I(0)} end`,
                            directives: () => [B()],
                        },
                        {
                            html: `beginning ${I(0)} end`,
                            directives: () => [B()],
                        },
                        {
                            html: `${I(0)} end`,
                            directives: () => [B()],
                        },
                        {
                            html: `${I(0)}${I(1)}`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `${I(0)}${I(1)} end`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `beginning ${I(0)}${I(1)} end`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `start ${I(0)}${I(1)}`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `${I(0)}separator${I(1)}`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `${I(0)}separator${I(1)} end`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `beginning ${I(0)}separator${I(1)} end`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `beginning ${I(0)}separator${I(1)}`,
                            directives: () => [B(), B()],
                        },
                        {
                            html: `<div>start ${I(0)} end</div><a href="${I(1)}">${I(
                                2
                            )}</a> ${I(3)} end`,
                            directives: () => [B(), B(), B(), B()],
                        },
                    ];

                    const s = scenarios[idx];
                    const { fragment } = compile(s.html, s.directives());
                    return {
                        firstNotNull: fragment.firstChild !== null,
                        lastNotNull: fragment.lastChild !== null,
                    };
                }, sIdx);

                expect(result.firstNotNull).toBe(true);
                expect(result.lastNotNull).toBe(true);
            });

            for (let pIdx = 0; pIdx < policyNames.length; pIdx++) {
                const pName = policyNames[pIdx];

                test(`handles ${sType} binding expression(s) with ${pName} policy`, async ({
                    page,
                }) => {
                    const result = await page.evaluate(
                        async ([si, pi]: [number, number]) => {
                            // @ts-expect-error: Client module.
                            const {
                                Compiler,
                                Markup,
                                HTMLBindingDirective,
                                oneWay,
                                DOM,
                                createTrackableDOMPolicy,
                                toHTML,
                            } = await import("/main.js");

                            const I = (n: number) => Markup.interpolation(`${n}`);
                            const B = (r = "result") =>
                                new HTMLBindingDirective(oneWay(() => r));
                            const compile = (h: string, dirs: any[], pol?: any) => {
                                const fac: any = Object.create(null);
                                let nid = -1;
                                const add = (f: any) => {
                                    const id = `${++nid}`;
                                    f.id = id;
                                    fac[id] = f;
                                    return id;
                                };
                                dirs.forEach((x: any) => x.createHTML(add));
                                return Compiler.compile(h, fac, pol) as any;
                            };

                            const policy = createTrackableDOMPolicy();
                            const policies = [
                                {
                                    provided: policy,
                                    expected: policy,
                                },
                                {
                                    provided: undefined,
                                    expected: DOM.policy,
                                },
                            ];

                            const scenarios = [
                                {
                                    html: ``,
                                    directives: () => [] as any[],
                                    fragment: ``,
                                    childCount: 0,
                                    targetIds: undefined as string[] | undefined,
                                },
                                {
                                    html: `<template></template>`,
                                    directives: () => [] as any[],
                                    fragment: ``,
                                    childCount: 0,
                                    targetIds: undefined as string[] | undefined,
                                },
                                {
                                    html: `${I(0)}`,
                                    directives: () => [B()],
                                    fragment: ` `,
                                    targetIds: ["r.1"],
                                    childCount: 2,
                                },
                                {
                                    html: `${I(0)} end`,
                                    directives: () => [B()],
                                    fragment: `  end`,
                                    targetIds: ["r.1"],
                                    childCount: 3,
                                },
                                {
                                    html: `beginning ${I(0)} end`,
                                    directives: () => [B()],
                                    fragment: `beginning   end`,
                                    targetIds: ["r.2"],
                                    childCount: 4,
                                },
                                {
                                    html: `${I(0)} end`,
                                    directives: () => [B()],
                                    fragment: `  end`,
                                    targetIds: ["r.1"],
                                    childCount: 3,
                                },
                                {
                                    html: `${I(0)}${I(1)}`,
                                    directives: () => [B(), B()],
                                    fragment: `  `,
                                    targetIds: ["r.1", "r.2"],
                                    childCount: 3,
                                },
                                {
                                    html: `${I(0)}${I(1)} end`,
                                    directives: () => [B(), B()],
                                    fragment: `   end`,
                                    targetIds: ["r.1", "r.2"],
                                    childCount: 4,
                                },
                                {
                                    html: `beginning ${I(0)}${I(1)} end`,
                                    directives: () => [B(), B()],
                                    fragment: `beginning    end`,
                                    targetIds: ["r.2", "r.3"],
                                    childCount: 5,
                                },
                                {
                                    html: `start ${I(0)}${I(1)}`,
                                    directives: () => [B(), B()],
                                    fragment: `start   `,
                                    targetIds: ["r.2", "r.3"],
                                    childCount: 4,
                                },
                                {
                                    html: `${I(0)}separator${I(1)}`,
                                    directives: () => [B(), B()],
                                    fragment: ` separator `,
                                    targetIds: ["r.1", "r.3"],
                                    childCount: 4,
                                },
                                {
                                    html: `${I(0)}separator${I(1)} end`,
                                    directives: () => [B(), B()],
                                    fragment: ` separator  end`,
                                    targetIds: ["r.1", "r.3"],
                                    childCount: 5,
                                },
                                {
                                    html: `beginning ${I(0)}separator${I(1)} end`,
                                    directives: () => [B(), B()],
                                    fragment: `beginning  separator  end`,
                                    targetIds: ["r.2", "r.4"],
                                    childCount: 6,
                                },
                                {
                                    html: `beginning ${I(0)}separator${I(1)}`,
                                    directives: () => [B(), B()],
                                    fragment: `beginning  separator `,
                                    targetIds: ["r.2", "r.4"],
                                    childCount: 5,
                                },
                                {
                                    html: `<div>start ${I(0)} end</div><a href="${I(
                                        1
                                    )}">${I(2)}</a> ${I(3)} end`,
                                    directives: () => [B(), B(), B(), B()],
                                    fragment: "<div>start   end</div><a> </a>   end",
                                    targetIds: ["r.0.1", "r.1", "r.1.0", "r.3"],
                                    childCount: 5,
                                },
                            ];

                            const s = scenarios[si];
                            const pol = policies[pi];
                            const directives = s.directives();
                            const { fragment, factories } = compile(
                                s.html,
                                directives,
                                pol.provided
                            );

                            const htmlResult = toHTML(fragment);
                            const cloneHtml = toHTML((fragment as any).cloneNode(true));

                            let childCount: number | null = null;
                            let cloneChildCount: number | null = null;
                            if (s.childCount) {
                                childCount = fragment.childNodes.length;
                                cloneChildCount = (fragment as any).cloneNode(true)
                                    .childNodes.length;
                            }

                            const factoryCount = factories.length;
                            const directiveCount = directives.length;

                            let targetNodeIds: string[] | null = null;
                            let policiesMatch = true;
                            if (s.targetIds) {
                                targetNodeIds = [];
                                for (let i = 0; i < factories.length; ++i) {
                                    targetNodeIds.push(factories[i].targetNodeId);
                                    if (factories[i].policy !== pol.expected) {
                                        policiesMatch = false;
                                    }
                                }
                            }

                            return {
                                htmlResult,
                                cloneHtml,
                                expectedFragment: s.fragment,
                                childCount,
                                cloneChildCount,
                                expectedChildCount: s.childCount || null,
                                factoryCount,
                                directiveCount,
                                targetNodeIds,
                                expectedTargetIds: s.targetIds || null,
                                policiesMatch,
                            };
                        },
                        [sIdx, pIdx] as [number, number]
                    );

                    expect(result.htmlResult).toBe(result.expectedFragment);
                    expect(result.cloneHtml).toBe(result.expectedFragment);

                    if (result.expectedChildCount) {
                        expect(result.childCount).toBe(result.expectedChildCount);
                        expect(result.cloneChildCount).toBe(result.expectedChildCount);
                    }

                    expect(result.factoryCount).toBe(result.directiveCount);

                    if (result.expectedTargetIds) {
                        expect(result.factoryCount).toBe(result.expectedTargetIds.length);
                        expect(result.targetNodeIds).toEqual(result.expectedTargetIds);
                        expect(result.policiesMatch).toBe(true);
                    }
                });
            }
        }

        test("fixes content that looks like an attribute to have the correct aspect type", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    Compiler,
                    HTMLBindingDirective,
                    HTMLDirective,
                    oneWay,
                    DOMAspect,
                } = await import("/main.js");

                const factories: any = Object.create(null);
                let nextId = -1;
                const add = (factory: any) => {
                    const id = `${++nextId}`;
                    factory.id = id;
                    factories[id] = factory;
                    return id;
                };

                const binding = new HTMLBindingDirective(oneWay((x: any) => x));
                HTMLDirective.assignAspect(binding, "a");
                const html = `a=${binding.createHTML(add)}`;

                const compiled = Compiler.compile(html, factories) as any;
                const bindingFactory = compiled.factories[0];

                return {
                    aspectType: bindingFactory.aspectType,
                    expectedAspectType: DOMAspect.content,
                };
            });

            expect(result.aspectType).toBe(result.expectedAspectType);
        });
    });

    test.describe("when compiling attributes", () => {
        const attrScenarioTypes = [
            "no",
            "a single",
            "a single starting",
            "a single middle",
            "a single ending",
            "back-to-back",
            "back-to-back starting",
            "back-to-back middle",
            "back-to-back ending",
            "separated",
            "separated starting",
            "separated middle",
            "separated ending",
            "multiple attributes on the same element with",
            "attributes on different elements with",
            "multiple attributes on different elements with",
        ];

        for (let sIdx = 0; sIdx < attrScenarioTypes.length; sIdx++) {
            const sType = attrScenarioTypes[sIdx];

            for (let pIdx = 0; pIdx < policyNames.length; pIdx++) {
                const pName = policyNames[pIdx];

                test(`handles ${sType} binding expression(s) with ${pName} policy`, async ({
                    page,
                }) => {
                    const result = await page.evaluate(
                        async ([si, pi]: [number, number]) => {
                            // @ts-expect-error: Client module.
                            const {
                                Compiler,
                                Markup,
                                HTMLBindingDirective,
                                oneWay,
                                DOM,
                                createTrackableDOMPolicy,
                                toHTML,
                                Fake,
                            } = await import("/main.js");

                            const I = (n: number) => Markup.interpolation(`${n}`);
                            const B = (r = "result") =>
                                new HTMLBindingDirective(oneWay(() => r));
                            const compile = (h: string, dirs: any[], pol?: any) => {
                                const fac: any = Object.create(null);
                                let nid = -1;
                                const add = (f: any) => {
                                    const id = `${++nid}`;
                                    f.id = id;
                                    fac[id] = f;
                                    return id;
                                };
                                dirs.forEach((x: any) => x.createHTML(add));
                                return Compiler.compile(h, fac, pol) as any;
                            };

                            const policy = createTrackableDOMPolicy();
                            const policies = [
                                {
                                    provided: policy,
                                    expected: policy,
                                },
                                {
                                    provided: undefined,
                                    expected: DOM.policy,
                                },
                            ];

                            const scenarios = [
                                {
                                    html: `<a href="https://www.fast.design/">FAST</a>`,
                                    directives: () => [] as any[],
                                    fragment: `<a href="https://www.fast.design/">FAST</a>`,
                                    result: undefined as string | undefined,
                                    targetIds: undefined as string[] | undefined,
                                },
                                {
                                    html: `<a href="${I(0)}">Link</a>`,
                                    directives: () => [B()],
                                    fragment: `<a>Link</a>`,
                                    result: "result",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)} end">Link</a>`,
                                    directives: () => [B()],
                                    fragment: `<a>Link</a>`,
                                    result: "result end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="beginning ${I(0)} end">Link</a>`,
                                    directives: () => [B()],
                                    fragment: `<a>Link</a>`,
                                    result: "beginning result end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)} end">Link</a>`,
                                    directives: () => [B()],
                                    fragment: `<a>Link</a>`,
                                    result: "result end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}${I(1)}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "resultresult",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}${I(1)} end">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "resultresult end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="beginning ${I(0)}${I(
                                        1
                                    )} end">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "beginning resultresult end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="start ${I(0)}${I(1)}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "start resultresult",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}separator${I(1)}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "resultseparatorresult",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}separator${I(
                                        1
                                    )} end">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "resultseparatorresult end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="beginning ${I(0)}separator${I(
                                        1
                                    )} end">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "beginning resultseparatorresult end",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="beginning ${I(0)}separator${I(
                                        1
                                    )}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: "beginning resultseparatorresult",
                                    targetIds: ["r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}" target="${I(1)}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a>`,
                                    result: undefined as string | undefined,
                                    targetIds: ["r.1", "r.1"],
                                },
                                {
                                    html: `<a href="${I(0)}">Link</a><a href="${I(
                                        1
                                    )}">Link</a>`,
                                    directives: () => [B(), B()],
                                    fragment: `<a>Link</a><a>Link</a>`,
                                    result: undefined as string | undefined,
                                    targetIds: ["r.0", "r.1"],
                                },
                                {
                                    html: `\n          <a href="${I(0)}" target="${I(
                                        1
                                    )}">Link</a>\n          <a href="${I(2)}" target="${I(
                                        3
                                    )}">Link</a>\n        `,
                                    directives: () => [B(), B(), B(), B()],
                                    fragment: `\n          <a>Link</a>\n          <a>Link</a>\n        `,
                                    result: undefined as string | undefined,
                                    targetIds: ["r.1", "r.1", "r.3", "r.3"],
                                },
                            ];

                            const s = scenarios[si];
                            const pol = policies[pi];
                            const directives = s.directives();
                            const { fragment, factories } = compile(
                                s.html,
                                directives,
                                pol.provided
                            );

                            const htmlResult = toHTML(fragment);
                            const cloneHtml = toHTML((fragment as any).cloneNode(true));

                            let bindingResult: string | null = null;
                            if (s.result) {
                                bindingResult = (
                                    factories[0] as any
                                ).dataBinding.evaluate({}, Fake.executionContext());
                            }

                            let targetNodeIds: string[] | null = null;
                            let policiesMatch = true;
                            if (s.targetIds) {
                                targetNodeIds = [];
                                for (let i = 0; i < factories.length; ++i) {
                                    targetNodeIds.push(factories[i].targetNodeId);
                                    if (factories[i].policy !== pol.expected) {
                                        policiesMatch = false;
                                    }
                                }
                            }

                            return {
                                htmlResult,
                                cloneHtml,
                                expectedFragment: s.fragment,
                                bindingResult,
                                expectedResult: s.result || null,
                                targetNodeIds,
                                expectedTargetIds: s.targetIds || null,
                                expectedTargetCount: s.targetIds
                                    ? s.targetIds.length
                                    : null,
                                factoryCount: s.targetIds ? factories.length : null,
                                policiesMatch,
                            };
                        },
                        [sIdx, pIdx] as [number, number]
                    );

                    expect(result.htmlResult).toBe(result.expectedFragment);
                    expect(result.cloneHtml).toBe(result.expectedFragment);

                    if (result.expectedResult) {
                        expect(result.bindingResult).toBe(result.expectedResult);
                    }

                    if (result.expectedTargetIds) {
                        expect(result.factoryCount).toBe(result.expectedTargetCount);
                        expect(result.targetNodeIds).toEqual(result.expectedTargetIds);
                        expect(result.policiesMatch).toBe(true);
                    }
                });
            }
        }
    });

    test.describe("when compiling comments", () => {
        for (let pIdx = 0; pIdx < policyNames.length; pIdx++) {
            const pName = policyNames[pIdx];

            test(`preserves comments with ${pName} policy`, async ({ page }) => {
                const result = await page.evaluate(async (pi: number) => {
                    // @ts-expect-error: Client module.
                    const {
                        Compiler,
                        Markup,
                        HTMLBindingDirective,
                        oneWay,
                        DOM,
                        createTrackableDOMPolicy,
                        toHTML,
                    } = await import("/main.js");

                    const I = (n: number) => Markup.interpolation(`${n}`);
                    const B = (r = "result") => new HTMLBindingDirective(oneWay(() => r));
                    const compile = (h: string, dirs: any[], pol?: any) => {
                        const fac: any = Object.create(null);
                        let nid = -1;
                        const add = (f: any) => {
                            const id = `${++nid}`;
                            f.id = id;
                            fac[id] = f;
                            return id;
                        };
                        dirs.forEach((x: any) => x.createHTML(add));
                        return Compiler.compile(h, fac, pol) as any;
                    };

                    const policy = createTrackableDOMPolicy();
                    const policies = [
                        { provided: policy, expected: policy },
                        {
                            provided: undefined,
                            expected: DOM.policy,
                        },
                    ];

                    const pol = policies[pi];
                    const comment = `<!--This is a comment-->`;
                    const html = `\n                    ${comment}\n                    <a href="${I(
                        0
                    )}">Link</a>\n                `;

                    const { fragment, factories } = compile(html, [B()], pol.provided);
                    const htmlResult = toHTML(fragment, true);

                    let policiesMatch = true;
                    for (let i = 0, ii = factories.length; i < length; ++i) {
                        if (factories[i].policy !== pol.expected) {
                            policiesMatch = false;
                        }
                    }

                    return {
                        containsComment: htmlResult.includes(comment),
                        policiesMatch,
                    };
                }, pIdx);

                expect(result.containsComment).toBe(true);
                expect(result.policiesMatch).toBe(true);
            });
        }
    });

    test.describe("when compiling hosts", () => {
        const hostScenarioTypes = [
            "no",
            "a single",
            "a single starting",
            "a single middle",
            "a single ending",
            "back-to-back",
            "back-to-back starting",
            "back-to-back middle",
            "back-to-back ending",
            "separated",
            "separated starting",
            "separated middle",
            "separated ending",
            "multiple attributes on the same element with",
        ];

        for (let sIdx = 0; sIdx < hostScenarioTypes.length; sIdx++) {
            const sType = hostScenarioTypes[sIdx];

            for (let pIdx = 0; pIdx < policyNames.length; pIdx++) {
                const pName = policyNames[pIdx];

                test(`handles ${sType} binding expression(s) with ${pName} policy`, async ({
                    page,
                }) => {
                    const result = await page.evaluate(
                        async ([si, pi]: [number, number]) => {
                            // @ts-expect-error: Client module.
                            const {
                                Compiler,
                                Markup,
                                HTMLBindingDirective,
                                oneWay,
                                DOM,
                                createTrackableDOMPolicy,
                                toHTML,
                                Fake,
                            } = await import("/main.js");

                            const I = (n: number) => Markup.interpolation(`${n}`);
                            const B = (r = "result") =>
                                new HTMLBindingDirective(oneWay(() => r));
                            const compile = (h: string, dirs: any[], pol?: any) => {
                                const fac: any = Object.create(null);
                                let nid = -1;
                                const add = (f: any) => {
                                    const id = `${++nid}`;
                                    f.id = id;
                                    fac[id] = f;
                                    return id;
                                };
                                dirs.forEach((x: any) => x.createHTML(add));
                                return Compiler.compile(h, fac, pol) as any;
                            };

                            const policy = createTrackableDOMPolicy();
                            const policies = [
                                {
                                    provided: policy,
                                    expected: policy,
                                },
                                {
                                    provided: undefined,
                                    expected: DOM.policy,
                                },
                            ];

                            const scenarios = [
                                {
                                    html: `<template></template>`,
                                    directives: () => [] as any[],
                                    fragment: ``,
                                    result: undefined as string | undefined,
                                    targetIds: undefined as string[] | undefined,
                                },
                                {
                                    html: `<template class="${I(0)}"></template>`,
                                    directives: () => [B()],
                                    fragment: ``,
                                    result: "result",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)} end"></template>`,
                                    directives: () => [B()],
                                    fragment: ``,
                                    result: "result end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="beginning ${I(
                                        0
                                    )} end"></template>`,
                                    directives: () => [B()],
                                    fragment: ``,
                                    result: "beginning result end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)} end"></template>`,
                                    directives: () => [B()],
                                    fragment: ``,
                                    result: "result end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)}${I(1)}"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "resultresult",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)}${I(
                                        1
                                    )} end"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "resultresult end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="beginning ${I(0)}${I(
                                        1
                                    )} end"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "beginning resultresult end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="start ${I(0)}${I(
                                        1
                                    )}"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "start resultresult",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)}separator${I(
                                        1
                                    )}"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "resultseparatorresult",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)}separator${I(
                                        1
                                    )} end"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "resultseparatorresult end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="beginning ${I(0)}separator${I(
                                        1
                                    )} end"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "beginning resultseparatorresult end",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="beginning ${I(0)}separator${I(
                                        1
                                    )}"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: "beginning resultseparatorresult",
                                    targetIds: ["h"],
                                },
                                {
                                    html: `<template class="${I(0)}" role="${I(
                                        1
                                    )}"></template>`,
                                    directives: () => [B(), B()],
                                    fragment: ``,
                                    result: undefined as string | undefined,
                                    targetIds: ["h", "h"],
                                },
                            ];

                            const s = scenarios[si];
                            const pol = policies[pi];
                            const directives = s.directives();
                            const { fragment, factories } = compile(
                                s.html,
                                directives,
                                pol.provided
                            );

                            const htmlResult = toHTML(fragment);
                            const cloneHtml = toHTML((fragment as any).cloneNode(true));

                            let bindingResult: string | null = null;
                            if (s.result) {
                                bindingResult = (
                                    factories[0] as any
                                ).dataBinding.evaluate({}, Fake.executionContext());
                            }

                            let targetNodeIds: string[] | null = null;
                            let policiesMatch = true;
                            if (s.targetIds) {
                                targetNodeIds = [];
                                for (let i = 0; i < factories.length; ++i) {
                                    targetNodeIds.push(factories[i].targetNodeId);
                                    if (factories[i].policy !== pol.expected) {
                                        policiesMatch = false;
                                    }
                                }
                            }

                            return {
                                htmlResult,
                                cloneHtml,
                                expectedFragment: s.fragment,
                                bindingResult,
                                expectedResult: s.result || null,
                                targetNodeIds,
                                expectedTargetIds: s.targetIds || null,
                                expectedTargetCount: s.targetIds
                                    ? s.targetIds.length
                                    : null,
                                factoryCount: s.targetIds ? factories.length : null,
                                policiesMatch,
                            };
                        },
                        [sIdx, pIdx] as [number, number]
                    );

                    expect(result.htmlResult).toBe(result.expectedFragment);
                    expect(result.cloneHtml).toBe(result.expectedFragment);

                    if (result.expectedResult) {
                        expect(result.bindingResult).toBe(result.expectedResult);
                    }

                    if (result.expectedTargetIds) {
                        expect(result.factoryCount).toBe(result.expectedTargetCount);
                        expect(result.targetNodeIds).toEqual(result.expectedTargetIds);
                        expect(result.policiesMatch).toBe(true);
                    }
                });
            }
        }
    });

    test.describe("when supports adopted stylesheets", () => {
        let supportsAdoptedStyleSheets = false;

        test.beforeAll(async ({ browser }) => {
            const page = await browser.newPage();
            await page.goto("/");
            supportsAdoptedStyleSheets = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");
                return ElementStyles.supportsAdoptedStyleSheets;
            });
            await page.close();
        });

        test("handles templates with adoptedStyleSheets", async ({ page }) => {
            test.skip(
                !supportsAdoptedStyleSheets,
                "Browser does not support adoptedStyleSheets"
            );

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { customElement, FASTElement, html, css, uniqueElementName } =
                    await import("/main.js");

                const name = uniqueElementName();
                const tag = html.partial(name);

                const TestElement = class extends FASTElement {};
                customElement({
                    name,
                    template: html`
                        <div></div>
                    `,
                    styles: css`
                        :host {
                            display: "block";
                        }
                    `,
                })(TestElement);

                const viewTemplate = html`<${tag}></${tag}>`;

                const host = document.createElement("div");
                document.body.appendChild(host);

                const view = viewTemplate.create();
                view.appendTo(host);

                const testElement = host.firstElementChild!;
                const shadowRoot = testElement!.shadowRoot!;

                const afterAppend = (shadowRoot as any).adoptedStyleSheets!.length;

                view.remove();

                const afterRemove = (shadowRoot as any).adoptedStyleSheets!.length;

                view.appendTo(host);

                const afterReappend = (shadowRoot as any).adoptedStyleSheets!.length;

                document.body.removeChild(host);

                return { afterAppend, afterRemove, afterReappend };
            });

            expect(result.afterAppend).toBe(1);
            expect(result.afterRemove).toBe(1);
            expect(result.afterReappend).toBe(1);
        });
    });
});
