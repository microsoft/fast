import { attr, booleanConverter, FASTElement, observable } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";

export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

export class MenuItem extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean;
    private disabledChanged(): void {
        this.disabled
            ? this.classList.add("disabled")
            : this.classList.remove("disabled");
    }

    @attr({ attribute: "aria-expanded", mode: "reflect", converter: booleanConverter })
    public expanded: boolean = false;
    private expandedChanged(): void {
        this.expanded
            ? this.classList.add("expanded")
            : this.classList.remove("expanded");
    }

    @attr
    public role: MenuItemRole = MenuItemRole.menuitem;

    @attr
    public checked: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        this.$emit("click", e);

        // return true
        return true;
    };

    public handleMenuItemClick = (e: MouseEvent): void => {
        this.$emit("click", e);
    };

    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
    }
}
