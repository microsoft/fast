import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    item_parent: string = "Bat";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

class TestElementInnerWhen extends FASTElement {
    @observable
    list: Array<any> = [
        {
            show: true,
            text: "Foo",
        },
        {
            show: false,
            text: "Bar",
        },
    ];
}
TestElementInnerWhen.defineAsync({
    name: "test-element-inner-when",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
