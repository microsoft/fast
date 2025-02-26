import { TemplateElement } from "@microsoft/fast-btr";
import { attr, FASTElement } from "@microsoft/fast-element";

class CustomElement extends FASTElement {
    @attr
    text: string = "Hello";
}
CustomElement.define({
    name: "custom-element",
});

TemplateElement.define({
    name: "f-template",
});
