import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

// This element intentionally does NOT define "serverOnly" as a property.
// The f-when condition references "serverOnly" which only exists in server state,
// simulating the real-world scenario where <if condition="..."> uses server-only data.
class TestElement extends FASTElement {
    public clickCount: number = 0;

    public handleClick = (): void => {
        this.clickCount++;
        console.log("clicked:" + this.clickCount);
    };
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

// This element explicitly defines "someprop" as false.
// The server rendered with someprop=true (from JSON), so SSR content is present.
// During hydration, the client value is false, which should be respected.
class TestElementFalse extends FASTElement {
    @observable
    someprop: boolean = false;
}
RenderableFASTElement(TestElementFalse).defineAsync({
    name: "test-element-false",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
