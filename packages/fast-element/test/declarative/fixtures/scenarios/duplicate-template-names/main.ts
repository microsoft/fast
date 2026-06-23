import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

class DuplicateTemplateElement extends FASTElement {
    @attr
    public label: string = "";
}

DuplicateTemplateElement.define({
    name: "duplicate-template-element",
    template: declarativeTemplate(),
});

const hydration = enableHydration();
void hydration.whenHydrated.then(() => {
    (window as any).hydrationCompleted = true;
});
