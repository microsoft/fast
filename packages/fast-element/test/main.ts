import { enableDebug } from "../src/debug.js";

enableDebug();

export {
    AttributeConfiguration,
    AttributeDefinition,
    attr,
} from "../src/components/attributes.js";
export {
    AdoptedStyleSheetsStrategy,
    ElementController,
    StyleElementStrategy,
} from "../src/components/element-controller.js";
export type { FASTElementExtension } from "../src/components/fast-definitions.js";
export { FASTElementDefinition } from "../src/components/fast-definitions.js";
export { customElement, FASTElement } from "../src/components/fast-element.js";
export {
    HydrationMarkup,
    isHydratable,
} from "../src/components/hydration.js";
export {
    deferHydrationAttribute,
    enableHydration,
} from "../src/components/enable-hydration.js";
export { Context } from "../src/context.js";
export {
    all,
    Container,
    ContainerConfiguration,
    ContainerImpl,
    DefaultResolver,
    DI,
    FactoryImpl,
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
export { Fake } from "../src/testing/fakes.js";
export { uniqueElementName } from "../src/testing/fixture.js";
export { ChildModel, DerivedModel, Model } from "../src/testing/models.js";
export { composedContains, composedParent } from "../src/utilities.js";
export const conditionalTimeout = function (
    condition: boolean,
    iteration = 0,
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
export { createTrackableDOMPolicy, toHTML } from "../src/__test__/helpers.js";
export { Binding } from "../src/binding/binding.js";
export { oneTime } from "../src/binding/one-time.js";
export { listener, oneWay } from "../src/binding/one-way.js";
export { Signal, signal } from "../src/binding/signal.js";
export { twoWay } from "../src/binding/two-way.js";
export { isString } from "../src/interfaces.js";
export { Metadata } from "../src/metadata.js";
export { ArrayObserver, lengthOf, Splice } from "../src/observation/arrays.js";
export { ExecutionContext } from "../src/observation/observable.js";
export { emptyArray, FAST } from "../src/platform.js";
export { ownedState, reactive, state, watch } from "../src/state/exports.js";
export { CSSDirective, cssDirective } from "../src/styles/css-directive.js";
export { ChildrenDirective, children } from "../src/templating/children.js";
export { Compiler } from "../src/templating/compiler.js";
export { HTMLBindingDirective } from "../src/templating/html-binding-directive.js";
export { HTMLDirective, htmlDirective } from "../src/templating/html-directive.js";
export { Markup, nextId, Parser } from "../src/templating/markup.js";
export { elements } from "../src/templating/node-observation.js";
export {
    NodeTemplate,
    RenderBehavior,
    RenderDirective,
    RenderInstruction,
    render,
    renderWith,
} from "../src/templating/render.js";
export { RepeatBehavior, RepeatDirective, repeat } from "../src/templating/repeat.js";
export { SlottedDirective, slotted } from "../src/templating/slotted.js";
export { ViewTemplate } from "../src/templating/template.js";
export { HTMLView } from "../src/templating/view.js";
export { when } from "../src/templating/when.js";
export { fixture } from "../src/testing/fixture.js";
export function removeWhitespace(str: string): string {
    return str
        .trim()
        .split("\n")
        .map(s => s.trim())
        .join("");
}
