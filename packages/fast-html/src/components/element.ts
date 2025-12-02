import { attr, type Constructable, type FASTElement } from "@microsoft/fast-element";
import { deferHydrationAttribute } from "@microsoft/fast-element/element-hydration.js";
import { composedParent } from "@microsoft/fast-element/utilities.js";

/**
 * Waits for the `defer-hydration` attribute to be removed from the target element.
 *
 * @param target - The target element to wait for attribute removal
 */
function waitForAttributeRemoval(target: HTMLElement): Promise<void> {
    if (!target.hasAttribute(deferHydrationAttribute)) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            if (!target.hasAttribute(deferHydrationAttribute)) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(target, { attributeFilter: [deferHydrationAttribute] });
    });
}

/**
 * Waits until all ancestor elements no longer have the `defer-hydration` attribute.
 *
 * @param element - The element to wait for ancestor hydration
 */
async function waitForAncestorHydration(element: HTMLElement): Promise<void> {
    let ancestor = composedParent(element);

    while (ancestor) {
        if (
            ancestor instanceof HTMLElement &&
            ancestor.hasAttribute(deferHydrationAttribute)
        ) {
            await waitForAttributeRemoval(ancestor);
        }

        ancestor = composedParent(ancestor);
    }
}

/**
 * A mixin function that extends a base class with additional functionality for
 * rendering and hydration.
 *
 * @param BaseCtor - The base class to extend.
 * @returns A new class that extends the provided base class with additional functionality for rendering and hydration.
 * @public
 */
export function RenderableFASTElement<T extends Constructable<FASTElement>>(
    BaseCtor: T
): T {
    const C = class extends BaseCtor {
        deferHydration: boolean = true;

        /**
         * Prepares the element for hydration by calling the user-defined prepare method
         * and waiting for all ancestor elements to be hydrated.
         *
         * @returns A promise that resolves when the element is ready for hydration.
         */
        private async _prepare(): Promise<void> {
            if (this.prepare) {
                await this.prepare();
            }

            await waitForAncestorHydration(this);

            this.deferHydration = false;
        }

        constructor(...args: any[]) {
            super(...args);

            void this._prepare();
        }

        /**
         * A user defined function for determining if the element is ready to be hydrated.
         * This function will get called if it has been defined after the template is connected.
         */
        public async prepare?(): Promise<void>;
    };

    attr({ mode: "boolean", attribute: deferHydrationAttribute })(
        C.prototype,
        "deferHydration"
    );

    return C;
}
