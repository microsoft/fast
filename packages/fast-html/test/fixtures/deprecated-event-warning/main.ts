import { FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestAlpha extends FASTElement {
    public handleClick = (e: MouseEvent): void => {
        console.log(`alpha-click:${e.type}`);
    };
    public handleOtherClick = (e: MouseEvent): void => {
        console.log(`alpha-other:${e.type}`);
    };
}
RenderableFASTElement(TestAlpha).defineAsync({
    name: "test-alpha",
    templateOptions: "defer-and-hydrate",
});

class TestBeta extends FASTElement {
    public handleClick = (e: MouseEvent): void => {
        console.log(`beta-click:${e.type}`);
    };
}
RenderableFASTElement(TestBeta).defineAsync({
    name: "test-beta",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
