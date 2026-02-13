import { expect, test } from "@playwright/test";

test.describe("The html tag template helper", () => {
    test("transforms a string into a ViewTemplate.", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, ViewTemplate } = await import("/main.js");

            const template = html`
                This is a test HTML string.
            `;
            return template instanceof ViewTemplate;
        });

        expect(result).toBe(true);
    });

    const interpolationScenarios = [
        // string interpolation
        { type: "string", location: "at the beginning", scenarioIndex: 0 },
        { type: "string", location: "in the middle", scenarioIndex: 1 },
        { type: "string", location: "at the end", scenarioIndex: 2 },
        // number interpolation
        { type: "number", location: "at the beginning", scenarioIndex: 3 },
        { type: "number", location: "in the middle", scenarioIndex: 4 },
        { type: "number", location: "at the end", scenarioIndex: 5 },
        // expression interpolation
        { type: "expression", location: "at the beginning", scenarioIndex: 6 },
        { type: "expression", location: "in the middle", scenarioIndex: 7 },
        { type: "expression", location: "at the end", scenarioIndex: 8 },
        // directive interpolation
        { type: "directive", location: "at the beginning", scenarioIndex: 9 },
        { type: "directive", location: "in the middle", scenarioIndex: 10 },
        { type: "directive", location: "at the end", scenarioIndex: 11 },
        // template interpolation
        { type: "template", location: "at the beginning", scenarioIndex: 12 },
        { type: "template", location: "in the middle", scenarioIndex: 13 },
        { type: "template", location: "at the end", scenarioIndex: 14 },
        // mixed back-to-back
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the beginning",
            scenarioIndex: 15,
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "in the middle",
            scenarioIndex: 16,
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the end",
            scenarioIndex: 17,
        },
        // mixed separated
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the beginning",
            scenarioIndex: 18,
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "in the middle",
            scenarioIndex: 19,
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the end",
            scenarioIndex: 20,
        },
    ];

    for (const scenario of interpolationScenarios) {
        test(`inserts ${scenario.type} values ${scenario.location} of the html`, async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async idx => {
                // @ts-expect-error: Client module.
                const {
                    html,
                    ViewTemplate,
                    HTMLBindingDirective,
                    HTMLDirective,
                    htmlDirective,
                    Markup,
                    Parser,
                    DOMAspect,
                    isString,
                } = await import("/main.js");

                class TestDirective {
                    id;
                    nodeId;
                    createBehavior() {
                        return {};
                    }
                    createHTML(add) {
                        return Markup.comment(add(this));
                    }
                }
                htmlDirective()(TestDirective);

                class Model {
                    value = "value";
                    doSomething() {}
                }

                const FAKE = {
                    comment: Markup.comment("0"),
                    interpolation: Markup.interpolation("0"),
                };

                const stringValue = "string value";
                const numberValue = 42;

                const scenarios = [
                    // string
                    {
                        template: html`
                            ${stringValue} end
                        `,
                        result: `${FAKE.interpolation} end`,
                    },
                    {
                        template: html`
                            beginning ${stringValue} end
                        `,
                        result: `beginning ${FAKE.interpolation} end`,
                    },
                    {
                        template: html`
                            beginning ${stringValue}
                        `,
                        result: `beginning ${FAKE.interpolation}`,
                    },
                    // number
                    {
                        template: html`
                            ${numberValue} end
                        `,
                        result: `${FAKE.interpolation} end`,
                    },
                    {
                        template: html`
                            beginning ${numberValue} end
                        `,
                        result: `beginning ${FAKE.interpolation} end`,
                    },
                    {
                        template: html`
                            beginning ${numberValue}
                        `,
                        result: `beginning ${FAKE.interpolation}`,
                    },
                    // expression
                    {
                        template: html`
                            ${x => x.value} end
                        `,
                        result: `${FAKE.interpolation} end`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    {
                        template: html`
                            beginning ${x => x.value} end
                        `,
                        result: `beginning ${FAKE.interpolation} end`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    {
                        template: html`
                            beginning ${x => x.value}
                        `,
                        result: `beginning ${FAKE.interpolation}`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    // directive
                    {
                        template: html`
                            ${new TestDirective()} end
                        `,
                        result: `${FAKE.comment} end`,
                        expectDirectives: [TestDirective],
                    },
                    {
                        template: html`
                            beginning ${new TestDirective()} end
                        `,
                        result: `beginning ${FAKE.comment} end`,
                        expectDirectives: [TestDirective],
                    },
                    {
                        template: html`
                            beginning ${new TestDirective()}
                        `,
                        result: `beginning ${FAKE.comment}`,
                        expectDirectives: [TestDirective],
                    },
                    // template
                    {
                        template: html`
                            ${html`
                                sub-template
                            `}
                            end
                        `,
                        result: `${FAKE.interpolation} end`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    {
                        template: html`
                            beginning
                            ${html`
                                sub-template
                            `}
                            end
                        `,
                        result: `beginning ${FAKE.interpolation} end`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    {
                        template: html`
                            beginning
                            ${html`
                                sub-template
                            `}
                        `,
                        result: `beginning ${FAKE.interpolation}`,
                        expectDirectives: [HTMLBindingDirective],
                    },
                    // mixed back-to-back
                    {
                        template: html`
                            ${stringValue}${numberValue}${x =>
                                x.value}${new TestDirective()}
                            end
                        `,
                        result: `${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment} end`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                    {
                        template: html`
                            beginning
                            ${stringValue}${numberValue}${x =>
                                x.value}${new TestDirective()}
                            end
                        `,
                        result: `beginning ${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment} end`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                    {
                        template: html`
                            beginning
                            ${stringValue}${numberValue}${x =>
                                x.value}${new TestDirective()}
                        `,
                        result: `beginning ${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment}`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                    // mixed separated
                    {
                        template: html`
                            ${stringValue}separator${numberValue}separator${x =>
                                x.value}separator${new TestDirective()}
                            end
                        `,
                        result: `${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment} end`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                    {
                        template: html`
                            beginning
                            ${stringValue}separator${numberValue}separator${x =>
                                x.value}separator${new TestDirective()}
                            end
                        `,
                        result: `beginning ${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment} end`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                    {
                        template: html`
                            beginning
                            ${stringValue}separator${numberValue}separator${x =>
                                x.value}separator${new TestDirective()}
                        `,
                        result: `beginning ${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment}`,
                        expectDirectives: [
                            HTMLBindingDirective,
                            HTMLBindingDirective,
                            TestDirective,
                        ],
                    },
                ];

                const x = scenarios[idx];

                // expectTemplateEquals
                function expectTemplateEquals(template, expectedHTML) {
                    if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";

                    const parts = Parser.parse(template.html, {});

                    if (parts !== null) {
                        const result = parts.reduce(
                            (a, b) =>
                                isString(b) ? a + b : a + Markup.interpolation("0"),
                            ""
                        );
                        if (result !== expectedHTML)
                            return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                    } else {
                        if (template.html !== expectedHTML)
                            return `html mismatch: got "${template.html}" expected "${expectedHTML}"`;
                    }

                    return null;
                }

                const htmlError = expectTemplateEquals(x.template, x.result);
                if (htmlError) return htmlError;

                if (x.expectDirectives) {
                    for (const type of x.expectDirectives) {
                        let found = false;

                        for (const id in x.template.factories) {
                            const behaviorFactory = x.template.factories[id];

                            if (behaviorFactory instanceof type) {
                                found = true;

                                if (behaviorFactory instanceof HTMLBindingDirective) {
                                    if (
                                        behaviorFactory.aspectType !== DOMAspect.content
                                    ) {
                                        return `aspectType mismatch: expected ${DOMAspect.content}, got ${behaviorFactory.aspectType}`;
                                    }
                                }
                            }

                            if (behaviorFactory.id !== id) {
                                return `id mismatch: expected "${id}", got "${behaviorFactory.id}"`;
                            }
                        }

                        if (!found) return `directive type not found`;
                    }
                }

                return true;
            }, scenario.scenarioIndex);

            expect(result).toBe(true);
        });
    }

    test("captures an attribute with an expression", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element some-attribute=${x => x.value}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.attribute)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures an attribute with a binding", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                oneWay,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element some-attribute=${oneWay(x => x.value)}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.attribute)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures an attribute with an interpolated string", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };
            const stringValue = "string value";

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element some-attribute=${stringValue}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.attribute)
                return `aspectType: ${factory.aspectType}`;
            if (
                factory.dataBinding.evaluate(null, Fake.executionContext()) !==
                stringValue
            )
                return "binding value mismatch";

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures an attribute with an interpolated number", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };
            const numberValue = 42;

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element some-attribute=${numberValue}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.attribute)
                return `aspectType: ${factory.aspectType}`;
            if (
                factory.dataBinding.evaluate(null, Fake.executionContext()) !==
                numberValue
            )
                return "binding value mismatch";

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a boolean attribute with an expression", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element ?some-attribute=${x => x.value}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "?some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.booleanAttribute)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a boolean attribute with a binding", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                oneWay,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element ?some-attribute=${oneWay(x => x.value)}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "?some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.booleanAttribute)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a boolean attribute with an interpolated boolean", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element ?some-attribute=${true}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "?some-attribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "some-attribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.booleanAttribute)
                return `aspectType: ${factory.aspectType}`;
            if (factory.dataBinding.evaluate(null, Fake.executionContext()) !== true)
                return "binding value mismatch";

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive property with an expression", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element :someAttribute=${x => x.value}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== ":someAttribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someAttribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.property)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive property with a binding", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                oneWay,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element :someAttribute=${oneWay(x => x.value)}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== ":someAttribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someAttribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.property)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive property with an interpolated string", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };
            const stringValue = "string value";

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element :someAttribute=${stringValue}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== ":someAttribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someAttribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.property)
                return `aspectType: ${factory.aspectType}`;
            if (
                factory.dataBinding.evaluate(null, Fake.executionContext()) !==
                stringValue
            )
                return "binding value mismatch";

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive property with an interpolated number", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
                Fake,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };
            const numberValue = 42;

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element :someAttribute=${numberValue}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== ":someAttribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someAttribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.property)
                return `aspectType: ${factory.aspectType}`;
            if (
                factory.dataBinding.evaluate(null, Fake.executionContext()) !==
                numberValue
            )
                return "binding value mismatch";

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive property with an inline directive", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                HTMLDirective,
                htmlDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            class TestDirective2 {
                sourceAspect;
                targetAspect;
                aspectType = DOMAspect.property;
                id;
                nodeId;
                createBehavior() {
                    return { bind() {}, unbind() {} };
                }
                createHTML(add) {
                    return Markup.interpolation(add(this));
                }
            }
            htmlDirective({ aspected: true })(TestDirective2);

            const template = html`
                <my-element :someAttribute=${new TestDirective2()}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            // Find the TestDirective2 factory
            let factory = null;
            for (const id in template.factories) {
                if (template.factories[id] instanceof TestDirective2) {
                    factory = template.factories[id];
                    break;
                }
            }
            if (!factory) return "no factory";
            if (factory.sourceAspect !== ":someAttribute")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someAttribute")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.property)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("captures a case-sensitive event when used with an expression", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                html,
                ViewTemplate,
                HTMLBindingDirective,
                Markup,
                Parser,
                DOMAspect,
                isString,
            } = await import("/main.js");

            const FAKE = { interpolation: Markup.interpolation("0") };

            function expectTemplateEquals(template, expectedHTML) {
                if (!(template instanceof ViewTemplate)) return "not a ViewTemplate";
                const parts = Parser.parse(template.html, {});
                if (parts !== null) {
                    const result = parts.reduce(
                        (a, b) => (isString(b) ? a + b : a + Markup.interpolation("0")),
                        ""
                    );
                    if (result !== expectedHTML)
                        return `html mismatch: got "${result}" expected "${expectedHTML}"`;
                } else {
                    if (template.html !== expectedHTML) return `html mismatch`;
                }
                return null;
            }

            function getFactory(template, type) {
                for (const id in template.factories) {
                    if (template.factories[id] instanceof type)
                        return template.factories[id];
                }
                return null;
            }

            const template = html`
                <my-element @someEvent=${x => x.doSomething()}></my-element>
            `;

            const htmlErr = expectTemplateEquals(
                template,
                `<my-element @someEvent=${FAKE.interpolation}></my-element>`
            );
            if (htmlErr) return htmlErr;

            const factory = getFactory(template, HTMLBindingDirective);
            if (!factory) return "no factory";
            if (factory.sourceAspect !== "@someEvent")
                return `sourceAspect: ${factory.sourceAspect}`;
            if (factory.targetAspect !== "someEvent")
                return `targetAspect: ${factory.targetAspect}`;
            if (factory.aspectType !== DOMAspect.event)
                return `aspectType: ${factory.aspectType}`;

            return true;
        });

        expect(result).toBe(true);
    });

    test("should dispose of embedded ViewTemplate when the rendering template contains *only* the embedded template", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html } = await import("/main.js");

            const embedded = html`
                <div id="embedded"></div>
            `;
            const template = html`
                ${x => embedded}
            `;
            const target = document.createElement("div");
            const view = template.render(undefined, target);

            const before = target.querySelector("#embedded") !== null;

            view.dispose();

            const after = target.querySelector("#embedded") === null;

            return before && after;
        });

        expect(result).toBe(true);
    });

    test("Should properly interpolate HTML tags with opening / closing tags using html.partial", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html } = await import("/main.js");

            const element = html.partial("button");
            const template = html`<${element}></${element}>`;
            return template.html === "<button></button>";
        });

        expect(result).toBe(true);
    });
});

test.describe("The ViewTemplate", () => {
    test("lazily compiles", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, Compiler } = await import("/main.js");

            let hasCompiled = false;
            const compile = Compiler.compile;
            Compiler.setDefaultStrategy((h, directives, policy) => {
                hasCompiled = true;
                return compile(h, directives, policy);
            });

            const template = html`
                This is a test.
            `;

            const before = hasCompiled === false;

            template.create();
            Compiler.setDefaultStrategy(compile);

            const after = hasCompiled === true;

            return before && after;
        });

        expect(result).toBe(true);
    });

    test("passes its dom policy along to the compiler", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, Compiler, createTrackableDOMPolicy } = await import("/main.js");

            const trackedPolicy = createTrackableDOMPolicy();
            const template = html`
                This is a test.
            `.withPolicy(trackedPolicy);
            let capturedPolicy;

            const compile = Compiler.compile;
            Compiler.setDefaultStrategy((h, directives, policy) => {
                capturedPolicy = policy;
                return compile(h, directives, policy);
            });

            template.create();
            Compiler.setDefaultStrategy(compile);

            return capturedPolicy === trackedPolicy;
        });

        expect(result).toBe(true);
    });

    test("prevents assigning a policy more than once", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, createTrackableDOMPolicy } = await import("/main.js");

            const trackedPolicy = createTrackableDOMPolicy();
            const template = html`
                This is a test.
            `.withPolicy(trackedPolicy);

            let didThrow = false;
            try {
                const differentPolicy = createTrackableDOMPolicy();
                template.withPolicy(differentPolicy);
            } catch (e) {
                didThrow = true;
            }

            return didThrow;
        });

        expect(result).toBe(true);
    });

    test("can inline a basic template built by the tagged template helper", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html } = await import("/main.js");

            const nested = html`
                Nested
            `;
            const root = html`
                Before${nested.inline()}After
            `;

            return root.html === "BeforeNestedAfter";
        });

        expect(result).toBe(true);
    });

    test("can inline a basic template built from a template element", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, ViewTemplate } = await import("/main.js");

            const templateEl = document.createElement("template");
            templateEl.innerHTML = "Nested";
            const nested = new ViewTemplate(templateEl);

            const root = html`
                Before${nested.inline()}After
            `;

            return root.html === "BeforeNestedAfter";
        });

        expect(result).toBe(true);
    });

    test("can inline a template with directives built by the tagged template helper", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, Markup } = await import("/main.js");

            function getFirstBehavior(template) {
                for (const key in template.factories) {
                    return template.factories[key];
                }
            }

            const nested = html`
                Nested${x => x.foo}
            `;

            const root = html`
                Before${nested.inline()}After
            `;

            const nestedBehavior = getFirstBehavior(nested);
            const nestedBehaviorId = nestedBehavior?.id;
            const nestedBehaviorPlaceholder = Markup.interpolation(nestedBehaviorId);

            const htmlMatch =
                root.html === `BeforeNested${nestedBehaviorPlaceholder}After`;
            const behaviorMatch = getFirstBehavior(root) === nestedBehavior;

            return htmlMatch && behaviorMatch;
        });

        expect(result).toBe(true);
    });

    test("can inline a template with directives built from a template element", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, ViewTemplate, HTMLBindingDirective, Markup, nextId, oneWay } =
                await import("/main.js");

            function getFirstBehavior(template) {
                for (const key in template.factories) {
                    return template.factories[key];
                }
            }

            const nestedBehaviorId = nextId();
            const nestedBehaviorPlaceholder = Markup.interpolation(nestedBehaviorId);
            const templateEl = document.createElement("template");
            templateEl.innerHTML = `Nested${nestedBehaviorPlaceholder}`;
            const factories = {};
            factories[nestedBehaviorId] = new HTMLBindingDirective(oneWay(x => x.foo));
            const nested = new ViewTemplate(templateEl, factories);

            const nestedBehavior = getFirstBehavior(nested);
            const root = html`
                Before${nested.inline()}After
            `;

            const htmlMatch =
                root.html === `BeforeNested${nestedBehaviorPlaceholder}After`;
            const behaviorMatch = getFirstBehavior(root) === nestedBehavior;

            return htmlMatch && behaviorMatch;
        });

        expect(result).toBe(true);
    });
});
