import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends FASTElement {
    public video: HTMLVideoElement | null = null;
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
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
