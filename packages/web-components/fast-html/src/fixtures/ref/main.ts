import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
