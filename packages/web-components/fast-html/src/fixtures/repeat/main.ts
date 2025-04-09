import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    parent: string = "Bat";
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
