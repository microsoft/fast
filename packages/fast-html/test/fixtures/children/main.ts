import { FASTElement, observable } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @observable
    listItems: Node[] = [];

    @observable
    list: Array<string> = ["Foo", "Bar"];
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
