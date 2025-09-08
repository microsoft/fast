import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "hydrate",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.defineAsync({
    name: "test-element-unescaped",
    templateOptions: "hydrate",
});

TemplateElement.define({
    name: "f-template",
});
