import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    @attr
    foo: string = "";

    public handleNoArgsClick = (): void => {
        console.log("no args");
    };

    /** @deprecated Use handleDollarEArgClick with $e instead */
    public handleEventArgClick = (e: MouseEvent): void => {
        console.log(e.type);
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
