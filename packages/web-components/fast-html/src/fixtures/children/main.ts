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
    shadowOptions: null,
});

TemplateElement.options({
    "test-element": {
        shadowOptions: {
            mode: "closed",
        },
    },
}).define({
    name: "f-template",
});
