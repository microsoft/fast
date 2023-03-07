import { expect } from "chai";
import { html, ViewTemplate } from "./template.js";
import { Markup, nextId, Parser } from "./markup.js";
import { HTMLBindingDirective } from "./html-binding-directive.js";
import { HTMLDirective, ViewBehaviorFactory, Aspected, htmlDirective, AddViewBehaviorFactory, CompiledViewBehaviorFactory } from "./html-directive.js";
import { Constructable, isString } from "../interfaces.js";
import { Fake } from "../testing/fakes.js";
import { DOMAspect, DOMPolicy } from "../dom.js";
import { createTrackableDOMPolicy } from "../__test__/helpers.js";
import { Compiler } from "./compiler.js";
import { oneWay } from "../binding/one-way.js";

describe(`The html tag template helper`, () => {
    it(`transforms a string into a ViewTemplate.`, () => {
        const template = html`This is a test HTML string.`;
        expect(template).instanceOf(ViewTemplate);
    });

    @htmlDirective()
    class TestDirective implements HTMLDirective, ViewBehaviorFactory {
        id: string;
        nodeId: string;

        createBehavior() {
            return {} as any;
        }

        createHTML(add: AddViewBehaviorFactory) {
            return Markup.comment(add(this));
        }
    }

    class Model {
        value: "value";
        doSomething() {}
    }

    const FAKE = {
        comment: Markup.comment("0"),
        interpolation: Markup.interpolation("0")
    };

    function expectTemplateEquals(template: ViewTemplate, expectedHTML: string) {
        expect(template).instanceOf(ViewTemplate);

        const parts = Parser.parse(template.html as string, {})!;

        if (parts !== null) {
            const result = parts.reduce((a, b) => isString(b)
                ? a + b
                : a + Markup.interpolation("0")
            , "");

            expect(result).to.equal(expectedHTML);
        } else {
            expect(template.html).to.equal(expectedHTML);
        }
    }

    const stringValue = "string value";
    const numberValue = 42;
    const interpolationScenarios = [
        // string interpolation
        {
            type: "string",
            location: "at the beginning",
            template: html`${stringValue} end`,
            result: `${FAKE.interpolation} end`,
        },
        {
            type: "string",
            location: "in the middle",
            template: html`beginning ${stringValue} end`,
            result: `beginning ${FAKE.interpolation} end`,
        },
        {
            type: "string",
            location: "at the end",
            template: html`beginning ${stringValue}`,
            result: `beginning ${FAKE.interpolation}`,
        },
        // number interpolation
        {
            type: "number",
            location: "at the beginning",
            template: html`${numberValue} end`,
            result: `${FAKE.interpolation} end`,
        },
        {
            type: "number",
            location: "in the middle",
            template: html`beginning ${numberValue} end`,
            result: `beginning ${FAKE.interpolation} end`,
        },
        {
            type: "number",
            location: "at the end",
            template: html`beginning ${numberValue}`,
            result: `beginning ${FAKE.interpolation}`,
        },
        // expression interpolation
        {
            type: "expression",
            location: "at the beginning",
            template: html<Model>`${x => x.value} end`,
            result: `${FAKE.interpolation} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "expression",
            location: "in the middle",
            template: html<Model>`beginning ${x => x.value} end`,
            result: `beginning ${FAKE.interpolation} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "expression",
            location: "at the end",
            template: html<Model>`beginning ${x => x.value}`,
            result: `beginning ${FAKE.interpolation}`,
            expectDirectives: [HTMLBindingDirective],
        },
        // directive interpolation
        {
            type: "directive",
            location: "at the beginning",
            template: html`${new TestDirective()} end`,
            result: `${FAKE.comment} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "in the middle",
            template: html`beginning ${new TestDirective()} end`,
            result: `beginning ${FAKE.comment} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "at the end",
            template: html`beginning ${new TestDirective()}`,
            result: `beginning ${FAKE.comment}`,
            expectDirectives: [TestDirective],
        },
        // template interpolation
        {
            type: "template",
            location: "at the beginning",
            template: html`${html`sub-template`} end`,
            result: `${FAKE.interpolation} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "template",
            location: "in the middle",
            template: html`beginning ${html`sub-template`} end`,
            result: `beginning ${FAKE.interpolation} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "template",
            location: "at the end",
            template: html`beginning ${html`sub-template`}`,
            result: `beginning ${FAKE.interpolation}`,
            expectDirectives: [HTMLBindingDirective],
        },
        // mixed interpolation
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}${numberValue}${x => x.value}${new TestDirective()} end`,
            result: `${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning ${stringValue}${numberValue}${x => x.value}${new TestDirective()} end`,
            result: `beginning ${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning ${stringValue}${numberValue}${x => x.value}${new TestDirective()}`,
            result: `beginning ${FAKE.interpolation}${FAKE.interpolation}${FAKE.interpolation}${FAKE.comment}`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()} end`,
            result: `${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning ${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()} end`,
            result: `beginning ${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning ${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()}`,
            result: `beginning ${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.interpolation}separator${FAKE.comment}`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
    ];

    interpolationScenarios.forEach(x => {
        it(`inserts ${x.type} values ${x.location} of the html`, () => {
            expectTemplateEquals(x.template, x.result);

            if (x.expectDirectives) {
                x.expectDirectives.forEach(type => {
                    let found = false;

                    for (const id in x.template.factories) {
                        const behaviorFactory = x.template.factories[id] as CompiledViewBehaviorFactory;

                        if (behaviorFactory instanceof type) {
                            found = true;

                            if (behaviorFactory instanceof HTMLBindingDirective) {
                                expect(behaviorFactory.aspectType).to.equal(DOMAspect.content);
                            }
                        }

                        expect(behaviorFactory.id).equals(id);
                    }

                    expect(found).to.be.true;
                });
            }
        });
    });

    function getFactory<T extends Constructable<ViewBehaviorFactory>>(
        template: ViewTemplate,
        type: T
    ): InstanceType<T> | null {
        for (const id in template.factories) {
            const potential = template.factories[id];

            if (potential instanceof type) {
                return potential as any as InstanceType<T>;
            }
        }

        return null;
    }

    function expectAspect<T extends Constructable<ViewBehaviorFactory>>(
        template: ViewTemplate,
        type: T,
        sourceAspect: string,
        targetAspect: string,
        aspectType: number
    ) {
        const factory = getFactory(template, type) as ViewBehaviorFactory & Aspected;
        expect(factory!).to.be.instanceOf(type);
        expect(factory!.sourceAspect).to.equal(sourceAspect);
        expect(factory!.targetAspect).to.equal(targetAspect);
        expect(factory!.aspectType).to.equal(aspectType);
    }

    it(`captures an attribute with an expression`, () => {
        const template = html<Model>`<my-element some-attribute=${x => x.value}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "some-attribute",
            "some-attribute",
            DOMAspect.attribute
        );
    });

    it(`captures an attribute with a binding`, () => {
        const template = html<Model>`<my-element some-attribute=${oneWay(x => x.value)}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "some-attribute",
            "some-attribute",
            DOMAspect.attribute
        );
    });

    it(`captures an attribute with an interpolated string`, () => {
        const template = html<Model>`<my-element some-attribute=${stringValue}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "some-attribute",
            "some-attribute",
            DOMAspect.attribute
        );

        const factory = getFactory(template, HTMLBindingDirective);
        expect(factory!.dataBinding.evaluate(null, Fake.executionContext())).equals(stringValue);
    });

    it(`captures an attribute with an interpolated number`, () => {
        const template = html<Model>`<my-element some-attribute=${numberValue}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "some-attribute",
            "some-attribute",
            DOMAspect.attribute
        );

        const factory = getFactory(template, HTMLBindingDirective);
        expect(factory!.dataBinding.evaluate(null, Fake.executionContext())).equals(numberValue);
    });

    it(`captures a boolean attribute with an expression`, () => {
        const template = html<Model>`<my-element ?some-attribute=${x => x.value}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "?some-attribute",
            "some-attribute",
            DOMAspect.booleanAttribute
        );
    });

    it(`captures a boolean attribute with a binding`, () => {
        const template = html<Model>`<my-element ?some-attribute=${oneWay(x => x.value)}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "?some-attribute",
            "some-attribute",
            DOMAspect.booleanAttribute
        );
    });

    it(`captures a boolean attribute with an interpolated boolean`, () => {
        const template = html<Model>`<my-element ?some-attribute=${true}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element ?some-attribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "?some-attribute",
            "some-attribute",
            DOMAspect.booleanAttribute
        );

        const factory = getFactory(template, HTMLBindingDirective);
        expect(factory!.dataBinding.evaluate(null, Fake.executionContext())).equals(true);
    });

    it(`captures a case-sensitive property with an expression`, () => {
        const template = html<Model>`<my-element :someAttribute=${x => x.value}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            ":someAttribute",
            "someAttribute",
            DOMAspect.property
        );
    });

    it(`captures a case-sensitive property with a binding`, () => {
        const template = html<Model>`<my-element :someAttribute=${oneWay(x => x.value)}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            ":someAttribute",
            "someAttribute",
            DOMAspect.property
        );
    });

    it(`captures a case-sensitive property with an interpolated string`, () => {
        const template = html<Model>`<my-element :someAttribute=${stringValue}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            ":someAttribute",
            "someAttribute",
            DOMAspect.property
        );

        const factory = getFactory(template, HTMLBindingDirective);
        expect(factory!.dataBinding.evaluate(null, Fake.executionContext())).equals(stringValue);
    });

    it(`captures a case-sensitive property with an interpolated number`, () => {
        const template = html<Model>`<my-element :someAttribute=${numberValue}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            ":someAttribute",
            "someAttribute",
            DOMAspect.property
        );

        const factory = getFactory(template, HTMLBindingDirective);
        expect(factory!.dataBinding.evaluate(null, Fake.executionContext())).equals(numberValue);
    });

    it(`captures a case-sensitive property with an inline directive`, () => {
        @htmlDirective({ aspected: true })
        class TestDirective implements HTMLDirective, Aspected {
            sourceAspect: string;
            targetAspect: string;
            aspectType = DOMAspect.property;
            id: string;
            nodeId: string;

            createBehavior() {
                return { bind() {}, unbind() {} };
            }

            public createHTML(add: AddViewBehaviorFactory): string {
                return Markup.interpolation(add(this));
            }
        }

        const template = html<Model>`<my-element :someAttribute=${new TestDirective()}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element :someAttribute=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            TestDirective,
            ":someAttribute",
            "someAttribute",
            DOMAspect.property
        );
    });

    it(`captures a case-sensitive event when used with an expression`, () => {
        const template = html<Model>`<my-element @someEvent=${x => x.doSomething()}></my-element>`;

        expectTemplateEquals(
            template,
            `<my-element @someEvent=${FAKE.interpolation}></my-element>`
        );

        expectAspect(
            template,
            HTMLBindingDirective,
            "@someEvent",
            "someEvent",
            DOMAspect.event
        );
    });

    it("should dispose of embedded ViewTemplate when the rendering template contains *only* the embedded template", () => {
        const embedded = html`<div id="embedded"></div>`
        const template = html`${x => embedded}`;
        const target = document.createElement("div");
        const view = template.render(void 0, target);

        expect(target.querySelector('#embedded')).not.to.be.equal(null)

        view.dispose();

        expect(target.querySelector('#embedded')).to.be.equal(null)
    });

    it("Should properly interpolate HTML tags with opening / closing tags using dangerousHTML", () => {
      const element = html.partial("button");
      const template = html`<${element}></${element}>`
      expect(template.html).to.equal('<button></button>')
    })
});

describe("The ViewTemplate", () => {
    it("lazily compiles", () => {
        let hasCompiled = false;
        const compile = Compiler.compile;
        Compiler.setDefaultStrategy((html, directives, policy) => {
            hasCompiled = true;
            return compile(html, directives, policy);
        });

        const template = html`This is a test.`;

        expect(hasCompiled).to.be.false;

        template.create();
        Compiler.setDefaultStrategy(compile);

        expect(hasCompiled).to.be.true;
    });

    it("passes its dom policy along to the compiler", () => {
        const trackedPolicy = createTrackableDOMPolicy();
        const template = html`This is a test.`.withPolicy(trackedPolicy);
        let capturedPolicy: DOMPolicy;

        const compile = Compiler.compile;
        Compiler.setDefaultStrategy((html, directives, policy) => {
            capturedPolicy = policy;
            return compile(html, directives, policy);
        });

        template.create();
        Compiler.setDefaultStrategy(compile);

        expect(capturedPolicy!).to.equal(trackedPolicy);
    });

    it("prevents assigning a policy more than once", () => {
        const trackedPolicy = createTrackableDOMPolicy();
        const template = html`This is a test.`.withPolicy(trackedPolicy);

        expect(() => {
            const differentPolicy = createTrackableDOMPolicy();
            template.withPolicy(differentPolicy);
        }).to.throw();
    });

    it("can inline a basic template built by the tagged template helper", () => {
        const nested = html`Nested`;

        const root = html`Before${nested.inline()}After`;

        expect(root.html).to.equal("BeforeNestedAfter");
    });

    it("can inline a basic template built from a template element", () => {
        const template = document.createElement("template");
        template.innerHTML = "Nested";
        const nested = new ViewTemplate(template);

        const root = html`Before${nested.inline()}After`;

        expect(root.html).to.equal("BeforeNestedAfter");
    });

    function getFirstBehavior(template: ViewTemplate) {
        for (const key in template.factories) {
            return template.factories[key];
        }
    }

    it("can inline a template with directives built by the tagged template helper", () => {
        const nested = html`Nested${x => x.foo}`;

        const root = html`Before${nested.inline()}After`;

        const nestedBehavior = getFirstBehavior(nested);
        const nestedBehaviorId = nestedBehavior?.id!;
        const nestedBehaviorPlaceholder = Markup.interpolation(nestedBehaviorId);

        expect(root.html).to.equal(`BeforeNested${nestedBehaviorPlaceholder}After`);
        expect(getFirstBehavior(root)).equals(nestedBehavior);
    });

    it("can inline a template with directives built from a template element", () => {
        const nestedBehaviorId = nextId();
        const nestedBehaviorPlaceholder = Markup.interpolation(nestedBehaviorId);
        const template = document.createElement("template");
        template.innerHTML = `Nested${nestedBehaviorPlaceholder}`;
        const nested = new ViewTemplate(template, {
            nestedBehaviorId: new HTMLBindingDirective(oneWay(x => x.foo))
        });

        const nestedBehavior = getFirstBehavior(nested);
        const root = html`Before${nested.inline()}After`;

        expect(root.html).to.equal(`BeforeNested${nestedBehaviorPlaceholder}After`);
        expect(getFirstBehavior(root)).equals(nestedBehavior);
    });
});
