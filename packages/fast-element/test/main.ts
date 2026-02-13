import "../src/debug.js";

export { customElement, FASTElement } from "../src/components/fast-element.js";
export {
    attr,
    AttributeConfiguration,
    AttributeDefinition,
} from "../src/components/attributes.js";
export {
    ElementController,
    HydratableElementController,
    AdoptedStyleSheetsStrategy,
    StyleElementStrategy,
} from "../src/components/element-controller.js";
export { FASTElementDefinition } from "../src/components/fast-definitions.js";
export { HydrationMarkup } from "../src/components/hydration.js";
export { Context } from "../src/context.js";
export {
    Container,
    ContainerConfiguration,
    ContainerImpl,
    DefaultResolver,
    DI,
    FactoryImpl,
    all,
    inject,
    lazy,
    optional,
    Registration,
    ResolverImpl,
    ResolverStrategy,
    singleton,
    transient,
} from "../src/di/di.js";
export { DOM, DOMAspect } from "../src/dom.js";
export { DOMPolicy } from "../src/dom-policy.js";
export { Observable, observable, volatile } from "../src/observation/observable.js";
export { Updates } from "../src/observation/update-queue.js";
export { css } from "../src/styles/css.js";
export { ElementStyles } from "../src/styles/element-styles.js";
export { ref } from "../src/templating/ref.js";
export { html } from "../src/templating/template.js";
export { uniqueElementName } from "../src/testing/fixture.js";
export { ChildModel, DerivedModel, Model } from "../src/testing/models.js";
export { Fake } from "../src/testing/fakes.js";
export { composedContains, composedParent } from "../src/utilities.js";
export const conditionalTimeout = function (
    condition: boolean,
    iteration = 0
): Promise<boolean> {
    return new Promise(function (resolve) {
        setTimeout(() => {
            if (iteration === 10 || condition) {
                resolve(true);
            }

            conditionalTimeout(condition, iteration + 1);
        }, 5);
    });
};
export { ArrayObserver, lengthOf, Splice } from "../src/observation/arrays.js";
export { ownedState, reactive, state, watch } from "../src/state/exports.js";
export { fixture } from "../src/testing/fixture.js";
export { CSSBindingDirective } from "../src/styles/css-binding-directive.js";
export { cssDirective, CSSDirective } from "../src/styles/css-directive.js";
export { ExecutionContext } from "../src/observation/observable.js";
export { Binding } from "../src/binding/binding.js";
export { oneTime } from "../src/binding/one-time.js";
export { oneWay, listener } from "../src/binding/one-way.js";
export { Signal, signal } from "../src/binding/signal.js";
export { twoWay } from "../src/binding/two-way.js";
export { HTMLBindingDirective } from "../src/templating/html-binding-directive.js";
export { ViewTemplate } from "../src/templating/template.js";
export { HTMLView } from "../src/templating/view.js";
export { HTMLDirective, htmlDirective } from "../src/templating/html-directive.js";
export { nextId } from "../src/templating/markup.js";
export { createTrackableDOMPolicy, toHTML } from "../src/__test__/helpers.js";
export { children, ChildrenDirective } from "../src/templating/children.js";
export { elements } from "../src/templating/node-observation.js";
export { Compiler } from "../src/templating/compiler.js";
export { Markup, Parser } from "../src/templating/markup.js";
export { when } from "../src/templating/when.js";
export {
    render,
    RenderBehavior,
    RenderDirective,
    RenderInstruction,
    NodeTemplate,
    renderWith,
} from "../src/templating/render.js";
export { repeat, RepeatBehavior, RepeatDirective } from "../src/templating/repeat.js";
export { slotted, SlottedDirective } from "../src/templating/slotted.js";
export { isString } from "../src/interfaces.js";
export { FAST, emptyArray } from "../src/platform.js";
export { Metadata } from "../src/metadata.js";
export function removeWhitespace(str: string): string {
    return str
        .trim()
        .split("\n")
        .map(s => s.trim())
        .join("");
}
