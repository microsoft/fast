import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementProperty extends FASTElement {
    @observable
    isEnabled: boolean = false;
}
RenderableFASTElement(TestElementProperty).defineAsync({
    name: "test-element-property",
    templateOptions: "defer-and-hydrate",
});

class TestElementExpression extends FASTElement {
    @attr({ attribute: "active-group" })
    activeGroup: string = "";

    @attr({ attribute: "current-group" })
    currentGroup: string = "";
}
RenderableFASTElement(TestElementExpression).defineAsync({
    name: "test-element-expression",
    templateOptions: "defer-and-hydrate",
});

let hydrationCompleteEmitted = false;
(window as any).getHydrationCompleteStatus = () => hydrationCompleteEmitted;

TemplateElement.config({
    hydrationComplete() {
        hydrationCompleteEmitted = true;
    },
}).define({
    name: "f-template",
});
