import { attr, FASTElement, Observable } from "@microsoft/fast-element";

export abstract class RenderableFASTElement extends FASTElement {
    @attr({ mode: "boolean", attribute: "defer-hydration" })
    deferHydration: boolean = true;

    @attr({ mode: "boolean", attribute: "needs-hydration" })
    needsHydration: boolean = true;

    constructor() {
        super();

        this.setAttribute("defer-hydration", "");
        this.setAttribute("needs-hydration", "");

        Observable.defineProperty(this.$fastController.definition, "shadowOptions");

        Observable.getNotifier(this.$fastController.definition).subscribe(
            {
                handleChange: () => {
                    this.deferHydration = false;
                },
            },
            "shadowOptions"
        );
    }
}
