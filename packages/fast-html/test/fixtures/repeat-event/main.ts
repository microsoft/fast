import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { FASTElement, observable } from "@microsoft/fast-element";

interface ListItem {
    name: string;
    expanded: boolean;
}

/**
 * Minimal repro for two issues with event bindings inside f-repeat:
 *
 * 1. @click on a <button> inside <f-repeat> does not fire after hydration.
 * 2. <f-when> inside <f-repeat> does not re-evaluate when item properties
 *    change via array replacement (e.g. immutable update pattern).
 */
export class RepeatEventElement extends FASTElement {
    @observable
    items: ListItem[] = [
        { name: "Alpha", expanded: false },
        { name: "Beta", expanded: false },
        { name: "Charlie", expanded: false },
    ];

    public lastClicked: string = "";

    public onItemClick(e: Event): void {
        const target = e.currentTarget as HTMLElement;
        const name = target.dataset.name ?? "";
        this.lastClicked = name;
        console.log("onItemClick fired:", name);

        // Immutable update: replace array with new objects toggling expanded.
        this.items = this.items.map((item) => {
            if (item.name !== name) return item;
            return { ...item, expanded: !item.expanded };
        });
    }
}

RenderableFASTElement(RepeatEventElement).defineAsync({
    name: "repeat-event-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
