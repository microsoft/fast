import { attr, type Constructable, type FASTElement } from "@microsoft/fast-element";

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
        needsHydration: boolean = true;

        constructor(...args: any[]) {
            super(...args);

            if ((this.$fastController as any).hasExistingShadowRoot) {
                this.toggleAttribute("defer-hydration", true);
            }

            (this.prepare?.() ?? Promise.resolve()).then(() => {
                this.deferHydration = false;
            });
        }

        /**
         * A user defined function for determining if the element is ready to be hydrated.
         * This function will get called if it has been defined after the template is connected.
         */
        public async prepare?(): Promise<void>;
    };

    attr({ mode: "boolean", attribute: "defer-hydration" })(
        C.prototype,
        "deferHydration"
    );

    attr({ mode: "boolean", attribute: "defer-hydration" })(
        C.prototype,
        "needsHydration"
    );

    return C;
}
