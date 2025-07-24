import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    foo: string = "";

    public handleNoArgsClick = (): void => {
        console.log("no args");
    };

    public handleEventArgClick = (e: MouseEvent): void => {
        console.log(e.type);
    };

    public handleAttributeArgClick = (foo: string): void => {
        console.log(foo);
    };

    public handleModifyAttributeClick() {
        this.foo = "modified-by-click";
    }
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
