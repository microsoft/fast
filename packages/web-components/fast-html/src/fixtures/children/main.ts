import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @observable
    listItems: Node[] = [];

    @observable
    list: Array<string> = ["Foo", "Bar"];
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
