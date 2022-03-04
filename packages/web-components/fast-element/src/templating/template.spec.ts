import { expect } from "chai";
import { html, ViewTemplate } from "./template";
import { Markup } from "./markup";
import { HTMLBindingDirective } from "./binding";
import { HTMLDirective } from "./html-directive";
import { bind, Binding, InlinableHTMLDirective, ViewBehaviorTargets } from "..";

describe(`The html tag template helper`, () => {
    it(`transforms a string into a ViewTemplate.`, () => {
        const template = html`This is a test HTML string.`;
        expect(template).instanceOf(ViewTemplate);
    });

    class TestDirective extends HTMLDirective {
        createBehavior() {
            return {} as any;
        }

        createPlaceholder(index: number) {
            return Markup.comment(index);
        }
    }

    class Model {
        value: "value";
    }
    const stringValue = "string value";
    const numberValue = 42;
    const interpolationScenarios = [
        // string interpolation
        {
            type: "string",
            location: "at the beginning",
            template: html`${stringValue} end`,
            result: `${stringValue} end`,
        },
        {
            type: "string",
            location: "in the middle",
            template: html`beginning ${stringValue} end`,
            result: `beginning ${stringValue} end`,
        },
        {
            type: "string",
            location: "at the end",
            template: html`beginning ${stringValue}`,
            result: `beginning ${stringValue}`,
        },
        // number interpolation
        {
            type: "number",
            location: "at the beginning",
            template: html`${numberValue} end`,
            result: `${Markup.interpolation(0)} end`,
        },
        {
            type: "number",
            location: "in the middle",
            template: html`beginning ${numberValue} end`,
            result: `beginning ${Markup.interpolation(0)} end`,
        },
        {
            type: "number",
            location: "at the end",
            template: html`beginning ${numberValue}`,
            result: `beginning ${Markup.interpolation(0)}`,
        },
        // expression interpolation
        {
            type: "expression",
            location: "at the beginning",
            template: html<Model>`${x => x.value} end`,
            result: `${Markup.interpolation(0)} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "expression",
            location: "in the middle",
            template: html<Model>`beginning ${x => x.value} end`,
            result: `beginning ${Markup.interpolation(0)} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "expression",
            location: "at the end",
            template: html<Model>`beginning ${x => x.value}`,
            result: `beginning ${Markup.interpolation(0)}`,
            expectDirectives: [HTMLBindingDirective],
        },
        // directive interpolation
        {
            type: "directive",
            location: "at the beginning",
            template: html`${new TestDirective()} end`,
            result: `${Markup.comment(0)} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "in the middle",
            template: html`beginning ${new TestDirective()} end`,
            result: `beginning ${Markup.comment(0)} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "at the end",
            template: html`beginning ${new TestDirective()}`,
            result: `beginning ${Markup.comment(0)}`,
            expectDirectives: [TestDirective],
        },
        // template interpolation
        {
            type: "template",
            location: "at the beginning",
            template: html`${html`sub-template`} end`,
            result: `${Markup.interpolation(0)} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "template",
            location: "in the middle",
            template: html`beginning ${html`sub-template`} end`,
            result: `beginning ${Markup.interpolation(0)} end`,
            expectDirectives: [HTMLBindingDirective],
        },
        {
            type: "template",
            location: "at the end",
            template: html`beginning ${html`sub-template`}`,
            result: `beginning ${Markup.interpolation(0)}`,
            expectDirectives: [HTMLBindingDirective],
        },
        // mixed interpolation
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}${numberValue}${x => x.value}${new TestDirective()} end`,
            result: `${stringValue}${Markup.interpolation(
                0
            )}${Markup.interpolation(
                1
            )}${Markup.comment(2)} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning ${stringValue}${numberValue}${x => x.value}${new TestDirective()} end`,
            result: `beginning ${stringValue}${Markup.interpolation(
                0
            )}${Markup.interpolation(
                1
            )}${Markup.comment(2)} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning ${stringValue}${numberValue}${x => x.value}${new TestDirective()}`,
            result: `beginning ${stringValue}${Markup.interpolation(
                0
            )}${Markup.interpolation(
                1
            )}${Markup.comment(2)}`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()} end`,
            result: `${stringValue}separator${Markup.interpolation(
                0
            )}separator${Markup.interpolation(
                1
            )}separator${Markup.comment(2)} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning ${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()} end`,
            result: `beginning ${stringValue}separator${Markup.interpolation(
                0
            )}separator${Markup.interpolation(
                1
            )}separator${Markup.comment(2)} end`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning ${stringValue}separator${numberValue}separator${x =>
                    x.value}separator${new TestDirective()}`,
            result: `beginning ${stringValue}separator${Markup.interpolation(
                0
            )}separator${Markup.interpolation(
                1
            )}separator${Markup.comment(2)}`,
            expectDirectives: [HTMLBindingDirective, HTMLBindingDirective, TestDirective],
        },
    ];

    interpolationScenarios.forEach(x => {
        it(`inserts ${x.type} values ${x.location} of the html`, () => {
            expect(x.template).instanceOf(ViewTemplate);
            expect(x.template.html).to.equal(x.result);

            if (x.expectDirectives) {
                x.expectDirectives.forEach((type, index) => {
                    expect(x.template.directives[index]).to.be.instanceOf(type);
                });
            }
        });
    });

    it(`captures a case-sensitive property name when used with an expression`, () => {
        const template = html<Model>`<my-element :someAttribute=${x => x.value}></my-element>`;
        const placeholder = Markup.interpolation(0);

        expect(template.html).to.equal(
            `<my-element :someAttribute=${placeholder}></my-element>`
        );
        expect((template.directives[0] as HTMLBindingDirective).rawAspect).to.equal(
            ":someAttribute"
        );
    });

    it(`captures a case-sensitive property name when used with a binding`, () => {
        const template = html<Model>`<my-element :someAttribute=${bind(x => x.value)}></my-element>`;
        const placeholder = Markup.interpolation(0);

        expect(template.html).to.equal(
            `<my-element :someAttribute=${placeholder}></my-element>`
        );
        expect((template.directives[0] as HTMLBindingDirective).rawAspect).to.equal(
            ":someAttribute"
        );
    });

    it(`captures a case-sensitive property name when used with an inline directive`, () => {
        class TestDirective extends InlinableHTMLDirective {
            binding: Binding;
            rawAspect: string;

            setAspect(value) {
                this.rawAspect = value;
            }

            createBehavior(targets: ViewBehaviorTargets) {
                return { bind() {}, unbind() {} };
            }
        }

        const template = html<Model>`<my-element :someAttribute=${new TestDirective()}></my-element>`;
        const placeholder = Markup.interpolation(0);

        expect(template.html).to.equal(
            `<my-element :someAttribute=${placeholder}></my-element>`
        );
        expect((template.directives[0] as TestDirective).rawAspect).to.equal(
            ":someAttribute"
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
    })
});
