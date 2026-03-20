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

TemplateElement.define({
    name: "f-template",
});
