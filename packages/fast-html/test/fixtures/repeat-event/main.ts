import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

export interface ItemType {
    name: string;
}

export class TestElementRepeatEvent extends FASTElement {
    @observable
    items: Array<ItemType> = [];

    @observable
    clickedItemName: string = "";

    // Regular method — `this` depends on the call-site binding.
    // Inside f-repeat, fast-html must bind `this` to the host element.
    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
    }
}
RenderableFASTElement(TestElementRepeatEvent).defineAsync({
    name: "test-element-repeat-event",
    templateOptions: "defer-and-hydrate",
});

// Scenario: f-when using $c.parent inside f-repeat
export class TestWhenInRepeat extends FASTElement {
    @observable items: Array<ItemType> = [{ name: "Alpha" }, { name: "Beta" }];
    @observable showNames: boolean = true;
    @observable clickedItemName: string = "";

    handleItemClick(e: Event) {
        this.clickedItemName = (e.currentTarget as HTMLButtonElement).textContent!;
        console.log(`Clicked item: ${this.clickedItemName}`);
    }
}
RenderableFASTElement(TestWhenInRepeat).defineAsync({
    name: "test-when-in-repeat",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "test-when-in-repeat": {
        observerMap: "all",
    },
}).define({
    name: "f-template",
});
