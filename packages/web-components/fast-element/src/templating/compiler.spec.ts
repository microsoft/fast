import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element.js";
import { Markup } from './markup.js';
import { ExecutionContext } from "../observation/observable.js";
import { css } from "../styles/css.js";
import { toHTML } from "../__test__/helpers.js";
import { bind, HTMLBindingDirective } from "./binding.js";
import { Compiler } from "./compiler.js";
import { Aspect, HTMLDirective, ViewBehaviorFactory } from "./html-directive.js";
import { html } from "./template.js";
import type { StyleTarget } from "../interfaces.js";
import { ElementStyles } from "../index.debug.js";
import { uniqueElementName } from "../testing/fixture.js";

/**
 * Used to satisfy TS by exposing some internal properties of the
 * compilation result that we want to make assertions against.
 */
interface CompilationResultInternals {
    readonly fragment: DocumentFragment;
    readonly factories: ViewBehaviorFactory[];
}

describe("The template compiler", () => {
    function compile(html: string, directives: HTMLDirective[]) {
        const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
        const ids: string[] = [];
        let nextId = -1;
        const add = (factory: ViewBehaviorFactory): string => {
            const id = `${++nextId}`;
            ids.push(id);
            factory.id = id;
            factories[id] = factory;
            return id;
        };

        directives.forEach(x => x.createHTML(add));

        return Compiler.compile(html, factories) as any as CompilationResultInternals;
    }

    function inline(index: number) {
        return Markup.interpolation(`${index}`);
    }

    function binding(result = "result") {
        return bind(() => result) as HTMLBindingDirective;
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
                targetIds: ['r.1'],
                childCount: 2,
            },
            {
                type: "a single starting",
                html: `${inline(0)} end`,
                directives: [binding()],
                fragment: `  end`,
                targetIds: ['r.1'],
                childCount: 3,
            },
            {
                type: "a single middle",
                html: `beginning ${inline(0)} end`,
                directives: [binding()],
                fragment: `beginning   end`,
                targetIds: ['r.2'],
                childCount: 4,
            },
            {
                type: "a single ending",
                html: `${inline(0)} end`,
                directives: [binding()],
                fragment: `  end`,
                targetIds: ['r.1'],
                childCount: 3,
            },
            {
                type: "back-to-back",
                html: `${inline(0)}${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `  `,
                targetIds: ['r.1', 'r.2'],
                childCount: 3,
            },
            {
                type: "back-to-back starting",
                html: `${inline(0)}${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `   end`,
                targetIds: ['r.1', 'r.2'],
                childCount: 4,
            },
            {
                type: "back-to-back middle",
                html: `beginning ${inline(0)}${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `beginning    end`,
                targetIds: ['r.2', 'r.3'],
                childCount: 5,
            },
            {
                type: "back-to-back ending",
                html: `start ${inline(0)}${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `start   `,
                targetIds: ['r.2', 'r.3'],
                childCount: 4,
            },
            {
                type: "separated",
                html: `${inline(0)}separator${inline(1)}`,
                directives: [binding(), binding()],
                fragment: ` separator `,
                targetIds: ['r.1', 'r.3'],
                childCount: 4,
            },
            {
                type: "separated starting",
                html: `${inline(0)}separator${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: ` separator  end`,
                targetIds: ['r.1', 'r.3'],
                childCount: 5,
            },
            {
                type: "separated middle",
                html: `beginning ${inline(0)}separator${inline(1)} end`,
                directives: [binding(), binding()],
                fragment: `beginning  separator  end`,
                targetIds: ['r.2', 'r.4'],
                childCount: 6,
            },
            {
                type: "separated ending",
                html: `beginning ${inline(0)}separator${inline(1)}`,
                directives: [binding(), binding()],
                fragment: `beginning  separator `,
                targetIds: ['r.2', 'r.4'],
                childCount: 5,
            },
            {
                type: "mixed content",
                html: `<div>start ${inline(0)} end</div><a href="${inline(1)}">${inline(
                    2
                )}</a> ${inline(3)} end`,
                directives: [binding(), binding(), binding(), binding()],
                fragment: "<div>start   end</div><a> </a>   end",
                targetIds: ['r.0.1', 'r.1', 'r.1.0', 'r.3'],
                childCount: 5,
            },
        ];

        scenarios.forEach(x => {
            it(`handles ${x.type} binding expression(s)`, () => {
                const { fragment, factories } = compile(x.html, x.directives);

                expect(toHTML(fragment)).to.equal(x.fragment);
                expect(toHTML(fragment.cloneNode(true) as DocumentFragment)).to.equal(
                    x.fragment
                );

                if (x.childCount) {
                    expect(fragment.childNodes.length).to.equal(x.childCount);
                    expect(fragment.cloneNode(true).childNodes.length).to.equal(
                        x.childCount
                    );
                }

                const length = factories.length;

                expect(length).to.equal(x.directives.length);

                if (x.targetIds) {
                    expect(length).to.equal(x.targetIds.length);

                    for (let i = 0; i < length; ++i) {
                        expect(factories[i].nodeId).to.equal(
                            x.targetIds[i]
                        );
                    }
                }
            });
        });

        it("fixes content that looks like an attribute to have the correct aspect type", () => {
            const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
            const ids: string[] = [];
            let nextId = -1;
            const add = (factory: ViewBehaviorFactory): string => {
                const id = `${++nextId}`;
                ids.push(id);
                factory.id = id;
                factories[id] = factory;
                return id;
            };

            const binding = bind(x => x) as HTMLBindingDirective;
            Aspect.assign(binding, "a"); // mimic the html function, which will think it's an attribute
            const html = `a=${binding.createHTML(add)}`;

            const result = Compiler.compile(html, factories) as any as CompilationResultInternals;
            const bindingFactory = result.factories[0] as HTMLBindingDirective;

            expect(bindingFactory.aspectType).equal(Aspect.content);
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
                targetIds: ['r.1'],
            },
            {
                type: "a single starting",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIds: ['r.1'],
            },
            {
                type: "a single middle",
                html: `<a href="beginning ${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "beginning result end",
                targetIds: ['r.1'],
            },
            {
                type: "a single ending",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back",
                html: `<a href="${inline(0)}${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back starting",
                html: `<a href="${inline(0)}${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back middle",
                html: `<a href="beginning ${inline(0)}${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultresult end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back ending",
                html: `<a href="start ${inline(0)}${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "start resultresult",
                targetIds: ['r.1'],
            },
            {
                type: "separated",
                html: `<a href="${inline(0)}separator${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult",
                targetIds: ['r.1'],
            },
            {
                type: "separated starting",
                html: `<a href="${inline(0)}separator${inline(1)} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult end",
                targetIds: ['r.1'],
            },
            {
                type: "separated middle",
                html: `<a href="beginning ${inline(0)}separator${inline(
                    1
                )} end">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult end",
                targetIds: ['r.1'],
            },
            {
                type: "separated ending",
                html: `<a href="beginning ${inline(0)}separator${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult",
                targetIds: ['r.1'],
            },
            {
                type: "multiple attributes on the same element with",
                html: `<a href="${inline(0)}" target="${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a>`,
                targetIds: ['r.1', 'r.1'],
            },
            {
                type: "attributes on different elements with",
                html: `<a href="${inline(0)}">Link</a><a href="${inline(1)}">Link</a>`,
                directives: [binding(), binding()],
                fragment: `<a>Link</a><a>Link</a>`,
                targetIds: ['r.0', 'r.1'],
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
                targetIds: ['r.1', 'r.1', 'r.3', 'r.3'],
            },
        ];

        scenarios.forEach(x => {
            it(`handles ${x.type} binding expression(s)`, () => {
                const { fragment, factories } = compile(x.html, x.directives);

                expect(toHTML(fragment)).to.equal(x.fragment);
                expect(toHTML(fragment.cloneNode(true) as DocumentFragment)).to.equal(
                    x.fragment
                );

                if (x.result) {
                    expect(
                        (factories[0] as HTMLBindingDirective).binding(
                            scope,
                            ExecutionContext.default
                        )
                    ).to.equal(x.result);
                }

                if (x.targetIds) {
                    const length = factories.length;

                    expect(length).to.equal(x.targetIds.length);

                    for (let i = 0; i < length; ++i) {
                        expect(factories[i].nodeId).to.equal(
                            x.targetIds[i]
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

    if (ElementStyles.supportsAdoptedStyleSheets) {
        it("handles templates with adoptedStyleSheets", () => {
            const name = uniqueElementName();

            @customElement({
                name,
                template: html`
                    <div></div>
                `,
                styles: css`
                    :host {
                        display: "block";
                    }
                `,
            })
            class TestElement extends FASTElement {}

            const viewTemplate = html`<${name}></${name}>`;

            const host = document.createElement("div");
            document.body.appendChild(host);

            const view = viewTemplate.create();
            view.appendTo(host);

            const testElement = host.firstElementChild!;
            const shadowRoot = testElement!.shadowRoot!;

            expect((shadowRoot as StyleTarget).adoptedStyleSheets!.length).to.equal(1);

            view.remove();

            expect((shadowRoot as StyleTarget).adoptedStyleSheets!.length).to.equal(1);

            view.appendTo(host);

            expect((shadowRoot as StyleTarget).adoptedStyleSheets!.length).to.equal(1);
        });
    }
});
