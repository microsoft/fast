import { attr, FastElement } from "@microsoft/fast-element";
import { bool } from "../utilities";

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

    public focusable: boolean = false;

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

    public hasItems: boolean;

    public items: HTMLSlotElement;
    public handleItemsChange(): void {
        this.hasItems = this.items.assignedNodes().length > 0;
    }

    // need to manage if this is a nested tree view item / items How???
    @attr
    private nested: boolean;
    private nestedChange(): void {
        this.nested ? this.classList.add("nested") : this.classList.remove("nested");
    }

    public handleFocus = (): void => {
        return;
    };

    public handleBlur = (): void => {
        return;
    };

    public handleKeyDown = (): void => {
        return;
    };

    public handleExpandCollapseButtonClick = (): void => {
        return;
    };

    public handleContainerClick = (): void => {
        return;
    };
}
