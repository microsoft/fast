import { attr, FastElement } from "@microsoft/fast-element";

export class TreeItem extends FastElement {
    @attr
    public expanded: boolean;

    @attr
    public selected: boolean;
    public selectedChange(): void {
        this.selected
            ? this.classList.add("selected")
            : this.classList.remove("selected");
    }

    public expandCollapseButton: HTMLDivElement;

    public treeItem: HTMLDivElement;

    // Different than React's state implementation
    public focusable: boolean;

    public afterContent: HTMLSlotElement;
    public afterContentContainer: HTMLSpanElement;
    public handleAfterContentChange(): void {
        this.afterContent.assignedNodes().length > 0
            ? this.afterContentContainer.classList.add("after-content")
            : this.afterContentContainer.classList.remove("after-content");
    }

    public beforeContent: HTMLSlotElement;
    public beforeContentContainer: HTMLSpanElement;
    public handleBeforeContentChange(): void {
        this.beforeContent.assignedNodes().length > 0
            ? this.beforeContentContainer.classList.add("before-content")
            : this.beforeContentContainer.classList.remove("before-content");
    }
}
