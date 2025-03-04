import { TemplateElement } from "@microsoft/fast-btr";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr({ mode: "boolean" })
    show: boolean = false;
}
TestElement.define({
    name: "test-element",
});

TemplateElement.define({
    name: "f-template",
});
