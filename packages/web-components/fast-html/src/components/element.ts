import { attr, FASTElement } from "@microsoft/fast-element";

export abstract class RenderableFASTElement extends FASTElement {
    @attr({ mode: "boolean", attribute: "defer-hydration" })
    deferHydration: boolean = true;

    constructor() {
        super();

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
    private async prepare?(): Promise<void>;
}
