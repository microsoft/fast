var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element";
import { DOM } from "../dom";
import { defaultExecutionContext } from "../observation/observable";
import { css } from "../styles/css";
import { toHTML, uniqueElementName } from "../__test__/helpers";
import { HTMLBindingDirective } from "./binding";
import { compileTemplate } from "./compiler";
import { html } from "./template";
describe("The template compiler", () => {
    function compile(html, directives) {
        const template = document.createElement("template");
        template.innerHTML = html;
        return compileTemplate(template, directives);
    }
    function inline(index) {
        return DOM.createInterpolationPlaceholder(index);
    }
    function binding(result = "result") {
        return new HTMLBindingDirective(() => result);
    }
    const scope = {};
    context("when compiling content", () => {
        const scenarios = [
            {
                type: "no",
                html: ``,
                directives: [],
                fragment: ``,
                childCount: 0,
            },
            {
                type: "a single",
                html: `${inline(0)}`,
                directives: [binding()],
                fragment: ` `,
                targetIndexes: [0],
                childCount: 2,
            },
            {
                type: "a single starting",
                html: `${inline(0)} end`,
                directives: [binding()],
                fragment: `  end`,
                targetIndexes: [0],
                childCount: 2,
            },
            {
                type: "a single middle",
                html: `beginning ${inline(0)} end`,
                directives: [binding()],
                fragment: `beginning   end`,
                targetIndexes: [1],
                childCount: 3,
            },
            {
                type: "a single ending",
                html: `${inline(0)} end`,
                directives: [binding()],
                fragment: `  end`,
                targetIndexes: [0],
                childCount: 2,
            },
            {
                type: "back-to-back",
                html: `${inline(0)}${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `  `,
                targetIndexes: [0, 1],
                childCount: 2,
            },
            {
                type: "back-to-back starting",
                html: `${inline(0)}${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `   end`,
                targetIndexes: [0, 1],
                childCount: 3,
            },
            {
                type: "back-to-back middle",
                html: `beginning ${inline(0)}${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `beginning    end`,
                targetIndexes: [1, 2],
                childCount: 4,
            },
            {
                type: "back-to-back ending",
                html: `start ${inline(0)}${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `start   `,
                targetIndexes: [1, 2],
                childCount: 3,
            },
            {
                type: "separated",
                html: `${inline(0)}separator${inline(1)}`,
                directives: [binding(), binding()],
                fragment: ` separator `,
                targetIndexes: [0, 2],
                childCount: 3,
            },
            {
                type: "separated starting",
                html: `${inline(0)}separator${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: ` separator  end`,
                targetIndexes: [0, 2],
                childCount: 4,
            },
            {
                type: "separated middle",
                html: `beginning ${inline(0)}separator${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `beginning  separator  end`,
                targetIndexes: [1, 3],
                childCount: 5,
            },
            {
                type: "separated ending",
                html: `beginning ${inline(0)}separator${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `beginning  separator `,
                targetIndexes: [1, 3],
                childCount: 4,
            },
            {
                type: "mixed content",
                html: `<div>start ${inline(0)} end</div><a href="${inline(1)}">${inline(
                    2
                )}</a> ${inline(3)} end`,
                directives: [binding(), binding(), binding(), binding()],
                fragment: "<div>start   end</div><a> </a>   end",
                targetIndexes: [2, 4, 5, 7],
                childCount: 5,
            },
        ];
        scenarios.forEach(x => {
            it(`handles ${x.type} binding expression(s)`, () => {
                const { fragment, viewBehaviorFactories } = compile(x.html, x.directives);
                expect(toHTML(fragment)).to.equal(x.fragment);
                expect(toHTML(fragment.cloneNode(true))).to.equal(x.fragment);
                if (x.childCount) {
                    expect(fragment.childNodes.length).to.equal(x.childCount);
                    expect(fragment.cloneNode(true).childNodes.length).to.equal(
                        x.childCount
                    );
                }
                const length = viewBehaviorFactories.length;
                expect(length).to.equal(x.directives.length);
                if (x.targetIndexes) {
                    expect(length).to.equal(x.targetIndexes.length);
                    for (let i = 0; i < length; ++i) {
                        expect(viewBehaviorFactories[i].targetIndex).to.equal(
                            x.targetIndexes[i]
                        );
                    }
                }
            });
        });
    });
    context("when compiling attributes", () => {
        const scenarios = [
            {
                type: "no",
                html: `<a href="https://www.fast.design/">FAST</a>`,
                directives: [],
                fragment: `<a href="https://www.fast.design/">FAST</a>`,
            },
            {
                type: "a single",
                html: `<a href="${inline(0)}">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "result",
                targetIndexes: [0],
            },
            {
                type: "a single starting",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIndexes: [0],
            },
            {
                type: "a single middle",
                html: `<a href="beginning ${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "beginning result end",
                targetIndexes: [0],
            },
            {
                type: "a single ending",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIndexes: [0],
            },
            {
                type: "back-to-back",
                html: `<a href="${inline(0)}${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult",
                targetIndexes: [0],
            },
            {
                type: "back-to-back starting",
                html: `<a href="${inline(0)}${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult end",
                targetIndexes: [0],
            },
            {
                type: "back-to-back middle",
                html: `<a href="beginning ${inline(0)}${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultresult end",
                targetIndexes: [0],
            },
            {
                type: "back-to-back ending",
                html: `<a href="start ${inline(0)}${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "start resultresult",
                targetIndexes: [0],
            },
            {
                type: "separated",
                html: `<a href="${inline(0)}separator${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult",
                targetIndexes: [0],
            },
            {
                type: "separated starting",
                html: `<a href="${inline(0)}separator${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult end",
                targetIndexes: [0],
            },
            {
                type: "separated middle",
                html: `<a href="beginning ${inline(0)}separator${inline(
                    1
                )} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult end",
                targetIndexes: [0],
            },
            {
                type: "separated ending",
                html: `<a href="beginning ${inline(0)}separator${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult",
                targetIndexes: [0],
            },
            {
                type: "multiple attributes on the same element with",
                html: `<a href="${inline(0)}" target="${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                targetIndexes: [0, 0],
            },
            {
                type: "attributes on different elements with",
                html: `<a href="${inline(0)}">Link</a><a href="${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a><a>Link</a>`,
                targetIndexes: [0, 2],
            },
            {
                type: "multiple attributes on different elements with",
                html: `
          <a href="${inline(0)}" target="${inline(1)}">Link</a>
          <a href="${inline(2)}" target="${inline(3)}">Link</a>
        `,
                directives: [binding(), binding(), binding(), binding()],
                fragment: `
          <a>Link</a>
          <a>Link</a>
        `,
                targetIndexes: [1, 1, 4, 4],
            },
        ];
        scenarios.forEach(x => {
            it(`handles ${x.type} binding expression(s)`, () => {
                const { fragment, viewBehaviorFactories } = compile(x.html, x.directives);
                expect(toHTML(fragment)).to.equal(x.fragment);
                expect(toHTML(fragment.cloneNode(true))).to.equal(x.fragment);
                if (x.result) {
                    expect(
                        viewBehaviorFactories[0].binding(scope, defaultExecutionContext)
                    ).to.equal(x.result);
                }
                if (x.targetIndexes) {
                    const length = viewBehaviorFactories.length;
                    expect(length).to.equal(x.targetIndexes.length);
                    for (let i = 0; i < length; ++i) {
                        expect(viewBehaviorFactories[i].targetIndex).to.equal(
                            x.targetIndexes[i]
                        );
                    }
                }
            });
        });
    });
    context("when compiling comments", () => {
        it("preserves comments", () => {
            const comment = `<!--This is a comment-->`;
            const html = `
                ${comment}
                <a href="${inline(0)}">Link</a>
            `;
            const { fragment } = compile(html, [binding()]);
            expect(toHTML(fragment, true)).to.contain(comment);
        });
    });
    context("when compiling hosts", () => {});
    if (DOM.supportsAdoptedStyleSheets) {
        it("handles templates with adoptedStyleSheets", () => {
            const name = uniqueElementName();
            let TestElement = class TestElement extends FASTElement {};
            TestElement = __decorate(
                [
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
                    }),
                ],
                TestElement
            );
            const viewTemplate = html`<${name}></${name}>`;
            const host = document.createElement("div");
            document.body.appendChild(host);
            const view = viewTemplate.create();
            view.appendTo(host);
            const testElement = host.firstElementChild;
            const shadowRoot = testElement.shadowRoot;
            expect(shadowRoot.adoptedStyleSheets.length).to.equal(1);
            view.remove();
            expect(shadowRoot.adoptedStyleSheets.length).to.equal(1);
            view.appendTo(host);
            expect(shadowRoot.adoptedStyleSheets.length).to.equal(1);
        });
    }
});
