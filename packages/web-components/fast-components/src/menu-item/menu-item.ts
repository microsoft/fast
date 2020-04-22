import { attr, booleanConverter, FASTElement, observable } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";

export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

export class MenuItem extends FASTElement {
    @observable
    public hasMenu: boolean = false;

    @observable
    public menuItemChildren: Node[];
    private menuItemChildrenChanged(): void {
        // casting as any below as if the property is undefined there is no menu
        this.hasMenu = this.menuItemChildren.some(
            x => (x as any).tagName === "FAST-MENU"
        );
    }

    /**
     * The anchored region which renders the menu
     */
    public menu: HTMLElement;

    /**
     * Reference to the first slotted menu
     */
    private _menu: HTMLElement;

    /**
     * Reference to top level viewport
     */
    public viewport: HTMLElement = document.getElementsByTagName("body")[0];

    @observable
    public slottedMenus: HTMLElement[];
    private slottedMenusChanged(): void {
        if (this.slottedMenus && this.slottedMenus.length > 0) {
            this._menu = this.slottedMenus[0];
        }
    }

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
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                if (!!this._menu) {
                    this.expanded = !this.expanded;
                    this._menu.focus();
                }
                // this.$emit("click", e);
                break;
        }

        return true;
    };

    public handleMenuItemClick = (e: MouseEvent): void => {
        if (!!this._menu) {
            this.expanded = !this.expanded;
            console.log(this.expanded);
        }
        // this.$emit("click", e);
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
