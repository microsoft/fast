import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

class TestElementProperty extends FASTElement {
    @observable
    isEnabled: boolean = false;
}
TestElementProperty.define({
    name: "test-element-property",
    template: declarativeTemplate(),
});

class TestElementExpression extends FASTElement {
    @attr({ attribute: "active-group" })
    activeGroup: string = "";

    @attr({ attribute: "current-group" })
    currentGroup: string = "";
}
TestElementExpression.define({
    name: "test-element-expression",
    template: declarativeTemplate(),
});

enableHydration({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
