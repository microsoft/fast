import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementProperty extends FASTElement {
    @observable
    isEnabled: boolean = false;
}
TestElementProperty.defineAsync({
    name: "test-element-property",
    templateOptions: "defer-and-hydrate",
});

class TestElementExpression extends FASTElement {
    @attr({ attribute: "active-group" })
    activeGroup: string = "";

    @attr({ attribute: "current-group" })
    currentGroup: string = "";
}
TestElementExpression.defineAsync({
    name: "test-element-expression",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
