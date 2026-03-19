import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

// This element explicitly defines "someprop" as false.
// The server rendered with someprop=true (from JSON), so SSR content is present.
// During hydration, the client value is false, which should be respected.
class TestElement extends FASTElement {
    @observable
    someprop: boolean = false;
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
