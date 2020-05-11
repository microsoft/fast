import chai from "chai";
import { html, ViewTemplate } from "./template.js";
import { DOM } from "./dom.js";
import { BindingDirective } from "./directives/binding.js";
import { Directive } from "./directives/directive.js";
const { expect } = chai;

describe(`The html tag template helper`, () => {
    it(`transforms a string into a ViewTemplate.`, () => {
        const template = html`This is a test HTML string.`;
        expect(template).instanceOf(ViewTemplate);
    });

    class TestDirective extends Directive {
        createBehavior() {
            return {} as any;
        }

        createPlaceholder(index: number) {
            return DOM.createBlockPlaceholder(index);
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
            result: `${numberValue} end`,
        },
        {
            type: "number",
            location: "in the middle",
            template: html`beginning ${numberValue} end`,
            result: `beginning ${numberValue} end`,
        },
        {
            type: "number",
            location: "at the end",
            template: html`beginning ${numberValue}`,
            result: `beginning ${numberValue}`,
        },
        // expression interpolation
        {
            type: "expression",
            location: "at the beginning",
            template: html<Model>`${x => x.value} end`,
            result: `${DOM.createInterpolationPlaceholder(0)} end`,
            expectDirectives: [BindingDirective],
        },
        {
            type: "expression",
            location: "in the middle",
            template: html<Model>`beginning ${x => x.value} end`,
            result: `beginning ${DOM.createInterpolationPlaceholder(0)} end`,
            expectDirectives: [BindingDirective],
        },
        {
            type: "expression",
            location: "at the end",
            template: html<Model>`beginning ${x => x.value}`,
            result: `beginning ${DOM.createInterpolationPlaceholder(0)}`,
            expectDirectives: [BindingDirective],
        },
        // directive interpolation
        {
            type: "directive",
            location: "at the beginning",
            template: html`${new TestDirective()} end`,
            result: `${DOM.createBlockPlaceholder(0)} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "in the middle",
            template: html`beginning ${new TestDirective()} end`,
            result: `beginning ${DOM.createBlockPlaceholder(0)} end`,
            expectDirectives: [TestDirective],
        },
        {
            type: "directive",
            location: "at the end",
            template: html`beginning ${new TestDirective()}`,
            result: `beginning ${DOM.createBlockPlaceholder(0)}`,
            expectDirectives: [TestDirective],
        },
        // mixed interpolation
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}${numberValue}${x =>
                x.value}${new TestDirective()}
            end`,
            result: `${stringValue}${numberValue}${DOM.createInterpolationPlaceholder(
                0
            )}${DOM.createBlockPlaceholder(1)} end`,
            expectDirectives: [BindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning
            ${stringValue}${numberValue}${x => x.value}${new TestDirective()} end`,
            result: `beginning ${stringValue}${numberValue}${DOM.createInterpolationPlaceholder(
                0
            )}${DOM.createBlockPlaceholder(1)} end`,
            expectDirectives: [BindingDirective, TestDirective],
        },
        {
            type: "mixed, back-to-back string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning
            ${stringValue}${numberValue}${x => x.value}${new TestDirective()}`,
            result: `beginning ${stringValue}${numberValue}${DOM.createInterpolationPlaceholder(
                0
            )}${DOM.createBlockPlaceholder(1)}`,
            expectDirectives: [BindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the beginning",
            template: html<Model>`${stringValue}separator${numberValue}separator${x =>
                x.value}separator${new TestDirective()}
            end`,
            result: `${stringValue}separator${numberValue}separator${DOM.createInterpolationPlaceholder(
                0
            )}separator${DOM.createBlockPlaceholder(1)} end`,
            expectDirectives: [BindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "in the middle",
            template: html<Model>`beginning
            ${stringValue}separator${numberValue}separator${x =>
                x.value}separator${new TestDirective()}
            end`,
            result: `beginning ${stringValue}separator${numberValue}separator${DOM.createInterpolationPlaceholder(
                0
            )}separator${DOM.createBlockPlaceholder(1)} end`,
            expectDirectives: [BindingDirective, TestDirective],
        },
        {
            type: "mixed, separated string, number, expression, and directive",
            location: "at the end",
            template: html<Model>`beginning
            ${stringValue}separator${numberValue}separator${x =>
                x.value}separator${new TestDirective()}`,
            result: `beginning ${stringValue}separator${numberValue}separator${DOM.createInterpolationPlaceholder(
                0
            )}separator${DOM.createBlockPlaceholder(1)}`,
            expectDirectives: [BindingDirective, TestDirective],
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
        const template = html<Model>`<my-element
            :someAttribute=${x => x.value}
        ></my-element>`;
        const placeholder = DOM.createInterpolationPlaceholder(0);

        expect(template.html).to.equal(
            `<my-element :someAttribute=${placeholder}></my-element>`
        );
        expect((template.directives[0] as BindingDirective).targetName).to.equal(
            ":someAttribute"
        );
    });
});
