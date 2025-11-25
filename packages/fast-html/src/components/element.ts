import {
    attr,
    type Constructable,
    deferHydrationAttribute,
    type FASTElement,
} from "@microsoft/fast-element";
import { waitForAncestorHydration } from "./utilities.js";

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

        constructor(...args: any[]) {
            super(...args);

            void this.#prepare();
        }

        /**
         * A user defined function for determining if the element is ready to be hydrated.
         * This function will get called if it has been defined after the template is connected.
         */
        public async prepare?(): Promise<void>;

        async #prepare(): Promise<void> {
            if (this.prepare) {
                await this.prepare();
            }

            await waitForAncestorHydration(this);

            this.deferHydration = false;
        }
    };

    attr({ mode: "boolean", attribute: deferHydrationAttribute })(
        C.prototype,
        "deferHydration"
    );

    return C;
}
