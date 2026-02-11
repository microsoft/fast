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
