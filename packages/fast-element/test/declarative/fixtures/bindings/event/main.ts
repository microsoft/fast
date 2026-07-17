import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";

class TestElement extends FASTElement {
    @attr
    foo: string = "";

    @observable
    items: Array<{ id: string; name: string }> = [
        { id: "id-1", name: "Item 1" },
        { id: "id-2", name: "Item 2" },
    ];

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

    public handleLiteralArgsClick = (
        text: string,
        count: number,
        enabled: boolean,
        empty: null,
        e: MouseEvent,
    ): void => {
        console.log(
            `${text},${typeof text},${count},${typeof count},${enabled},${typeof enabled},${empty},${e.type}`,
        );
    };

    public handleRepeatArgsClick = (id: string, source: string, e: MouseEvent): void => {
        console.log(`${id},${source},${e.type}`);
    };
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

const hydration = enableHydration();
void hydration.whenHydrated().then(() => {
    (window as any).hydrationCompleted = true;
});
