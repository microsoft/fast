import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { observable } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    parent: string = "Bat";
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

class TestElementInnerWhen extends RenderableFASTElement {
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
TestElementInnerWhen.define({
    name: "test-element-inner-when",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
