import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const status = {
    templateDidUpdateCount: 0,
    templateWillUpdateCount: 0,
};

(window as any).__duplicateTemplateStatus = status;

class DuplicateTemplateElement extends FASTElement {
    @attr
    public label: string = "";
}

DuplicateTemplateElement.define({
    name: "duplicate-template-element",
    template: declarativeTemplate({
        templateDidUpdate() {
            status.templateDidUpdateCount++;
        },
        templateWillUpdate() {
            status.templateWillUpdateCount++;
        },
    }),
});

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
