import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
RenderableFASTElement(TestElementUnescaped).defineAsync({
    name: "test-element-unescaped",
    templateOptions: "defer-and-hydrate",
});

let hydrationCompleteEmitted = false;
(window as any).getHydrationCompleteStatus = () => hydrationCompleteEmitted;

TemplateElement.config({
    hydrationComplete() {
        hydrationCompleteEmitted = true;
    },
}).define({
    name: "f-template",
});
