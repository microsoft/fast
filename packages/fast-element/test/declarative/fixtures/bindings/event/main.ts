import { attr, FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    @attr
    foo: string = "";

    public handleNoArgsClick = (): void => {
        console.log("no args");
    };

    public handleModifyAttributeClick = (): void => {
        this.foo = "modified-by-click";
    };

    public handleDollarEArgClick = (e: MouseEvent): void => {
        console.log(e.type);
    };

    public handleContextArgClick = (c: any): void => {
        console.log(c.event.type);
    };

    public handleMultiArgClick = (e: MouseEvent, c: any): void => {
        console.log(`${e.type},${c.event.type}`);
    };

    public handleContextEventArgClick = (e: MouseEvent): void => {
        console.log(e.type);
    };
}
TestElement.define({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
