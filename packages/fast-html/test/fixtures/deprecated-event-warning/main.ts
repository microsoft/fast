import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

class TestAlpha extends FASTElement {
    public handleClick = (e: MouseEvent): void => {
        console.log(`alpha-click:${e.type}`);
    };
    public handleOtherClick = (e: MouseEvent): void => {
        console.log(`alpha-other:${e.type}`);
    };
}
TestAlpha.define({
    name: "test-alpha",
    templateOptions: "defer-and-hydrate",
});

class TestBeta extends FASTElement {
    public handleClick = (e: MouseEvent): void => {
        console.log(`beta-click:${e.type}`);
    };
}
TestBeta.define({
    name: "test-beta",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
