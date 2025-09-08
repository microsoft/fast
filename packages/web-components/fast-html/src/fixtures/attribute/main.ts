import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    type: string = "radio";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
