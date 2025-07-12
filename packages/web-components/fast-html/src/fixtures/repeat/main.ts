import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { observable } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @observable
    list: Array<string> = ["Foo", "Bar"];

    parent: string = "Bat";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
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
TestElementInnerWhen.defineAsync({
    name: "test-element-inner-when",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
