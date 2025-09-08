import { type Constructable, FASTElement } from "@microsoft/fast-element";

abstract class DeferAndHydrateFASTElement extends FASTElement {
    deferHydration: boolean;
}

type DeferAndHydrateFASTElementType = DeferAndHydrateFASTElement;

/**
 * A mixin function that extends a base class with additional functionality for
 * rendering and hydration.
 *
 * @param BaseCtor - The base class to extend.
 * @returns A new class that extends the provided base class with additional functionality for rendering and hydration.
 * @public
 */
export function DeferredFASTElement<
    T extends Constructable<DeferAndHydrateFASTElementType>
>(BaseCtor: T): T {
    const C = class extends BaseCtor {
        constructor(...args: any[]) {
            super(...args);

            if (this.prepare) {
                this.prepare().then(() => {
                    this.deferHydration = false;
                });
            } else {
                this.deferHydration = false;
            }
        }

        /**
         * A user defined function for determining if the element is ready to be hydrated.
         * This function will get called if it has been defined after the template is connected.
         */
        public async prepare?(): Promise<void>;
    };

    return C;
}
