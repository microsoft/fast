import { TemplateElement } from "@microsoft/fast-html";
import { FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    public handleClick = (): void => {
        console.log("click!");
    };
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
