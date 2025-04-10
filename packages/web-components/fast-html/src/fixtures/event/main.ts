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
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
