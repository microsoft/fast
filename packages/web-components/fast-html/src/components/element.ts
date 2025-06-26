import { attr, FASTElement, Observable } from "@microsoft/fast-element";

export abstract class RenderableFASTElement extends FASTElement {
    @attr({ mode: "boolean", attribute: "defer-hydration" })
    deferHydration: boolean = true;

    @attr({ mode: "boolean", attribute: "needs-hydration" })
    needsHydration: boolean = true;

    constructor() {
        super();

        // If the elements template has already been defined there is no need to defer hydration.
        if (!this.$fastController?.definition?.shadowOptions) {
            this.setAttribute("defer-hydration", "");
            this.setAttribute("needs-hydration", "");
        }

        Observable.defineProperty(this.$fastController.definition, "shadowOptions");

        Observable.getNotifier(this.$fastController.definition).subscribe(
            {
                handleChange: async () => {
                    if (this.prepare) {
                        await this.prepare();
                    }

                    this.deferHydration = false;
                },
            },
            "shadowOptions"
        );
    }

    /**
     * A user defined function for determining if the element is ready to be hydrated.
     * This function will get called if it has been defined after the template is connected.
     */
    private async prepare?(): Promise<void>;
}
