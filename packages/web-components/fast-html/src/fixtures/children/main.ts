import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { observable } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @observable
    listItems: Node[] = [];

    @observable
    list: Array<string> = ["Foo", "Bar"];
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
