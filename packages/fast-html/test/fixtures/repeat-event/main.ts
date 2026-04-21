import { FASTElement, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-html";

export interface ItemType {
    name: string;
}

export class TestElementRepeatEvent extends FASTElement {
    @observable
    repeatEventItems: Array<ItemType> = [];

    @observable
    clickedItemName: string = "";

    // Called via $c.parent.handleItemClick — `this` is bound to the host
    // because the $c.parent path resolves the method owner from the context.
    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
    }
}
TestElementRepeatEvent.define({
    name: "test-element-repeat-event",
    templateOptions: "defer-and-hydrate",
});

// Scenario: f-when using showNames inside f-repeat
export class TestWhenInRepeat extends FASTElement {
    @observable whenRepeatItems: Array<ItemType> = [{ name: "Alpha" }, { name: "Beta" }];
    @observable showNames: boolean = true;
    @observable clickedItemName: string = "";

    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
        console.log(`Clicked item: ${this.clickedItemName}`);
    }
}
TestWhenInRepeat.define({
    name: "test-when-in-repeat",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "test-when-in-repeat": {
        observerMap: "all",
    },
})
    .config({
        hydrationComplete() {
            (window as any).hydrationCompleted = true;
        },
    })
    .define({
        name: "f-template",
    });
