import { expect } from "chai";
import { customElement, FASTElement } from "../components/fast-element.js";
import { Markup } from './markup.js';
import { css } from "../styles/css.js";
import { createTrackableDOMPolicy, toHTML } from "../__test__/helpers.js";
import { HTMLBindingDirective } from "./html-binding-directive.js";
import { Compiler } from "./compiler.js";
import { CompiledViewBehaviorFactory, HTMLDirective, ViewBehaviorFactory } from "./html-directive.js";
import { html } from "./template.js";
import { ElementStyles } from "../index.debug.js";
import { uniqueElementName } from "../testing/fixture.js";
import { Fake } from "../testing/fakes.js";
import { DOM, DOMAspect, DOMPolicy } from "../dom.js";
import { oneWay } from "../binding/one-way.js";

/**
 * Used to satisfy TS by exposing some internal properties of the
 * compilation result that we want to make assertions against.
 */
interface CompilationResultInternals {
    readonly fragment: DocumentFragment;
    readonly factories: CompiledViewBehaviorFactory[];
}

describe("The template compiler", () => {
    function compile(html: string, directives: HTMLDirective[], policy?: DOMPolicy) {
        const factories: Record<string, CompiledViewBehaviorFactory> = Object.create(null);
        const ids: string[] = [];
        let nextId = -1;
        const add = (factory: CompiledViewBehaviorFactory): string => {
            const id = `${++nextId}`;
            ids.push(id);
            factory.id = id;
            factories[id] = factory;
            return id;
        };

        directives.forEach(x => x.createHTML(add));

        return Compiler.compile(html, factories, policy) as any as CompilationResultInternals;
    }

    function inline(index: number) {
        return Markup.interpolation(`${index}`);
    }

    function binding(result = "result") {
        return new HTMLBindingDirective(oneWay(() => result));
    }

    const scope = {};
    const policy = createTrackableDOMPolicy();
    const policies = [
        {
            name: "custom",
            provided: policy,
            expected: policy
        },
        {
            name: "default",
            provided: undefined,
            expected: DOM.policy
        }
    ];

    context("when compiling content", () => {
        const scenarios = [
            {
                type: "no",
                html: ``,
                directives: () => [],
                fragment: ``,
                childCount: 0,
            },
            {
                type: "an empty template",
                html: `<template></template>`,
                directives: () => [],
                fragment: ``,
                childCount: 0,
            },
            {
                type: "a single",
                html: `${inline(0)}`,
                directives: () => [binding()],
                fragment: ` `,
                targetIds: ['r.1'],
                childCount: 2,
            },
            {
                type: "a single starting",
                html: `${inline(0)} end`,
                directives: () => [binding()],
                fragment: `  end`,
                targetIds: ['r.1'],
                childCount: 3,
            },
            {
                type: "a single middle",
                html: `beginning ${inline(0)} end`,
                directives: () => [binding()],
                fragment: `beginning   end`,
                targetIds: ['r.2'],
                childCount: 4,
            },
            {
                type: "a single ending",
                html: `${inline(0)} end`,
                directives: () => [binding()],
                fragment: `  end`,
                targetIds: ['r.1'],
                childCount: 3,
            },
            {
                type: "back-to-back",
                html: `${inline(0)}${inline(1)}`,
                directives: () => [binding(), binding()],
                fragment: `  `,
                targetIds: ['r.1', 'r.2'],
                childCount: 3,
            },
            {
                type: "back-to-back starting",
                html: `${inline(0)}${inline(1)} end`,
                directives: () => [binding(), binding()],
                fragment: `   end`,
                targetIds: ['r.1', 'r.2'],
                childCount: 4,
            },
            {
                type: "back-to-back middle",
                html: `beginning ${inline(0)}${inline(1)} end`,
                directives: () => [binding(), binding()],
                fragment: `beginning    end`,
                targetIds: ['r.2', 'r.3'],
                childCount: 5,
            },
            {
                type: "back-to-back ending",
                html: `start ${inline(0)}${inline(1)}`,
                directives: () => [binding(), binding()],
                fragment: `start   `,
                targetIds: ['r.2', 'r.3'],
                childCount: 4,
            },
            {
                type: "separated",
                html: `${inline(0)}separator${inline(1)}`,
                directives: () => [binding(), binding()],
                fragment: ` separator `,
                targetIds: ['r.1', 'r.3'],
                childCount: 4,
            },
            {
                type: "separated starting",
                html: `${inline(0)}separator${inline(1)} end`,
                directives: () => [binding(), binding()],
                fragment: ` separator  end`,
                targetIds: ['r.1', 'r.3'],
                childCount: 5,
            },
            {
                type: "separated middle",
                html: `beginning ${inline(0)}separator${inline(1)} end`,
                directives: () => [binding(), binding()],
                fragment: `beginning  separator  end`,
                targetIds: ['r.2', 'r.4'],
                childCount: 6,
            },
            {
                type: "separated ending",
                html: `beginning ${inline(0)}separator${inline(1)}`,
                directives: () => [binding(), binding()],
                fragment: `beginning  separator `,
                targetIds: ['r.2', 'r.4'],
                childCount: 5,
            },
            {
                type: "mixed content",
                html: `<div>start ${inline(0)} end</div><a href="${inline(1)}">${inline(
                    2
                )}</a> ${inline(3)} end`,
                directives: () => [binding(), binding(), binding(), binding()],
                fragment: "<div>start   end</div><a> </a>   end",
                targetIds: ['r.0.1', 'r.1', 'r.1.0', 'r.3'],
                childCount: 5,
            },
        ];

        scenarios.forEach(x => {
            it(`ensures that first and last child references are not null for ${x.type}`, () => {
                const { fragment } = compile(x.html, x.directives());

                expect(fragment.firstChild).not.to.be.null;
                expect(fragment.lastChild).not.to.be.null;
            })

            policies.forEach(y => {
                it(`handles ${x.type} binding expression(s) with ${y.name} policy`, () => {
                    const directives = x.directives();
                    const { fragment, factories } = compile(x.html, directives, y.provided);

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

                    expect(length).to.equal(directives.length);

                    if (x.targetIds) {
                        expect(length).to.equal(x.targetIds.length);

                        for (let i = 0; i < length; ++i) {
                            expect(factories[i].targetNodeId).to.equal(
                                x.targetIds[i]
                            );

                            expect(factories[i].policy).to.equal(
                                y.expected
                            );
                        }
                    }
                });
            });
        });

        it("fixes content that looks like an attribute to have the correct aspect type", () => {
            const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
            const ids: string[] = [];
            let nextId = -1;
            const add = (factory: CompiledViewBehaviorFactory): string => {
                const id = `${++nextId}`;
                ids.push(id);
                factory.id = id;
                factories[id] = factory;
                return id;
            };

            const binding = new HTMLBindingDirective(oneWay(x => x));
            HTMLDirective.assignAspect(binding, "a"); // mimic the html function, which will think it's an attribute
            const html = `a=${binding.createHTML(add)}`;

            const result = Compiler.compile(html, factories) as any as CompilationResultInternals;
            const bindingFactory = result.factories[0] as HTMLBindingDirective;

            expect(bindingFactory.aspectType).equal(DOMAspect.content);
        });
    });

    context("when compiling attributes", () => {
        const scenarios = [
            {
                type: "no",
                html: `<a href="https://www.fast.design/">FAST</a>`,
                directives: () => [],
                fragment: `<a href="https://www.fast.design/">FAST</a>`,
            },
            {
                type: "a single",
                html: `<a href="${inline(0)}">Link</a>`,
                directives:() => [binding()],
                fragment: `<a>Link</a>`,
                result: "result",
                targetIds: ['r.1'],
            },
            {
                type: "a single starting",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: () => [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIds: ['r.1'],
            },
            {
                type: "a single middle",
                html: `<a href="beginning ${inline(0)} end">Link</a>`,
                directives: () => [binding()],
                fragment: `<a>Link</a>`,
                result: "beginning result end",
                targetIds: ['r.1'],
            },
            {
                type: "a single ending",
                html: `<a href="${inline(0)} end">Link</a>`,
                directives: () => [binding()],
                fragment: `<a>Link</a>`,
                result: "result end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back",
                html: `<a href="${inline(0)}${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back starting",
                html: `<a href="${inline(0)}${inline(1)} end">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultresult end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back middle",
                html: `<a href="beginning ${inline(0)}${inline(1)} end">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultresult end",
                targetIds: ['r.1'],
            },
            {
                type: "back-to-back ending",
                html: `<a href="start ${inline(0)}${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "start resultresult",
                targetIds: ['r.1'],
            },
            {
                type: "separated",
                html: `<a href="${inline(0)}separator${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult",
                targetIds: ['r.1'],
            },
            {
                type: "separated starting",
                html: `<a href="${inline(0)}separator${inline(1)} end">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "resultseparatorresult end",
                targetIds: ['r.1'],
            },
            {
                type: "separated middle",
                html: `<a href="beginning ${inline(0)}separator${inline(
                    1
                )} end">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult end",
                targetIds: ['r.1'],
            },
            {
                type: "separated ending",
                html: `<a href="beginning ${inline(0)}separator${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                result: "beginning resultseparatorresult",
                targetIds: ['r.1'],
            },
            {
                type: "multiple attributes on the same element with",
                html: `<a href="${inline(0)}" target="${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a>`,
                targetIds: ['r.1', 'r.1'],
            },
            {
                type: "attributes on different elements with",
                html: `<a href="${inline(0)}">Link</a><a href="${inline(1)}">Link</a>`,
                directives: () => [binding(), binding()],
                fragment: `<a>Link</a><a>Link</a>`,
                targetIds: ['r.0', 'r.1'],
            },
            {
                type: "multiple attributes on different elements with",
                html: `
          <a href="${inline(0)}" target="${inline(1)}">Link</a>
          <a href="${inline(2)}" target="${inline(3)}">Link</a>
        `,
                directives: () => [binding(), binding(), binding(), binding()],
                fragment: `
          <a>Link</a>
          <a>Link</a>
        `,
                targetIds: ['r.1', 'r.1', 'r.3', 'r.3'],
            },
        ];

        scenarios.forEach(x => {
            policies.forEach(y => {
                it(`handles ${x.type} binding expression(s) with ${y.name} policy`, () => {
                    const { fragment, factories } = compile(x.html, x.directives(), y.provided);

                    expect(toHTML(fragment)).to.equal(x.fragment);
                    expect(toHTML(fragment.cloneNode(true) as DocumentFragment)).to.equal(
                        x.fragment
                    );

                    if (x.result) {
                        expect(
                            (factories[0] as HTMLBindingDirective).dataBinding.evaluate(
                                scope,
                                Fake.executionContext()
                            )
                        ).to.equal(x.result);
                    }

                    if (x.targetIds) {
                        const length = factories.length;

                        expect(length).to.equal(x.targetIds.length);

                        for (let i = 0; i < length; ++i) {
                            expect(factories[i].targetNodeId).to.equal(
                                x.targetIds[i]
                            );

                            expect(factories[i].policy).to.equal(y.expected);
                        }
                    }
                });
            });
        });
    });

    context("when compiling comments", () => {
        policies.forEach(y => {
            it(`preserves comments with ${y.name} policy`, () => {
                const comment = `<!--This is a comment-->`;
                const html = `
                    ${comment}
                    <a href="${inline(0)}">Link</a>
                `;

                const { fragment, factories } = compile(html, [binding()], y.provided);
                expect(toHTML(fragment, true)).to.contain(comment);

                for (let i = 0, ii = factories.length; i < length; ++i) {
                    expect(factories[i].policy).to.equal(y.expected);
                }
            });
        });
    });

    context("when compiling hosts", () => {
        const scenarios = [
            {
                type: "no",
                html: `<template></template>`,
                directives: () => [],
                fragment: ``,
            },
            {
                type: "a single",
                html: `<template class="${inline(0)}"></template>`,
                directives: () => [binding()],
                fragment: ``,
                result: "result",
                targetIds: ['h'],
            },
            {
                type: "a single starting",
                html: `<template class="${inline(0)} end"></template>`,
                directives: () => [binding()],
                fragment: ``,
                result: "result end",
                targetIds: ['h'],
            },
            {
                type: "a single middle",
                html: `<template class="beginning ${inline(0)} end"></template>`,
                directives: () => [binding()],
                fragment: ``,
                result: "beginning result end",
                targetIds: ['h'],
            },
            {
                type: "a single ending",
                html: `<template class="${inline(0)} end"></template>`,
                directives: () => [binding()],
                fragment: ``,
                result: "result end",
                targetIds: ['h'],
            },
            {
                type: "back-to-back",
                html: `<template class="${inline(0)}${inline(1)}"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "resultresult",
                targetIds: ['h'],
            },
            {
                type: "back-to-back starting",
                html: `<template class="${inline(0)}${inline(1)} end"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "resultresult end",
                targetIds: ['h'],
            },
            {
                type: "back-to-back middle",
                html: `<template class="beginning ${inline(0)}${inline(1)} end"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "beginning resultresult end",
                targetIds: ['h'],
            },
            {
                type: "back-to-back ending",
                html: `<template class="start ${inline(0)}${inline(1)}"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "start resultresult",
                targetIds: ['h'],
            },
            {
                type: "separated",
                html: `<template class="${inline(0)}separator${inline(1)}"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "resultseparatorresult",
                targetIds: ['h'],
            },
            {
                type: "separated starting",
                html: `<template class="${inline(0)}separator${inline(1)} end"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "resultseparatorresult end",
                targetIds: ['h'],
            },
            {
                type: "separated middle",
                html: `<template class="beginning ${inline(0)}separator${inline(
                    1
                )} end"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "beginning resultseparatorresult end",
                targetIds: ['h'],
            },
            {
                type: "separated ending",
                html: `<template class="beginning ${inline(0)}separator${inline(1)}"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                result: "beginning resultseparatorresult",
                targetIds: ['h'],
            },
            {
                type: "multiple attributes on the same element with",
                html: `<template class="${inline(0)}" role="${inline(1)}"></template>`,
                directives: () => [binding(), binding()],
                fragment: ``,
                targetIds: ['h', 'h'],
            }
        ];

        scenarios.forEach(x => {
            policies.forEach(y => {
                it(`handles ${x.type} binding expression(s) with ${y.name} policy`, () => {
                    const { fragment, factories } = compile(x.html, x.directives(), y.provided);

                    expect(toHTML(fragment)).to.equal(x.fragment);
                    expect(toHTML(fragment.cloneNode(true) as DocumentFragment)).to.equal(
                        x.fragment
                    );

                    if (x.result) {
                        expect(
                            (factories[0] as HTMLBindingDirective).dataBinding.evaluate(
                                scope,
                                Fake.executionContext()
                            )
                        ).to.equal(x.result);
                    }

                    if (x.targetIds) {
                        const length = factories.length;

                        expect(length).to.equal(x.targetIds.length);

                        for (let i = 0; i < length; ++i) {
                            expect(factories[i].targetNodeId).to.equal(
                                x.targetIds[i]
                            );

                            expect(factories[i].policy).to.equal(y.expected);
                        }
                    }
                });
            });
        });
    });

    if (ElementStyles.supportsAdoptedStyleSheets) {
        it("handles templates with adoptedStyleSheets", () => {
            const name = uniqueElementName();
            const tag = html.partial(name);

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

            const viewTemplate = html`<${tag}></${tag}>`;

            const host = document.createElement("div");
            document.body.appendChild(host);

            const view = viewTemplate.create();
            view.appendTo(host);

            const testElement = host.firstElementChild!;
            const shadowRoot = testElement!.shadowRoot!;

            expect((shadowRoot as any).adoptedStyleSheets!.length).to.equal(1);

            view.remove();

            expect((shadowRoot as any).adoptedStyleSheets!.length).to.equal(1);

            view.appendTo(host);

            expect((shadowRoot as any).adoptedStyleSheets!.length).to.equal(1);
        });
    }
});
