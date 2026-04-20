import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.defineAsync({
    name: "test-element-unescaped",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
