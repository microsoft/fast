import { TemplateElement } from "@microsoft/fast-html";
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

    public handleModifyAttributeClick = (): void => {
        this.foo = "modified-by-click";
    };
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
