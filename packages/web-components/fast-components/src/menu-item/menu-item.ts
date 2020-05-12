import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

export class MenuItem extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean;

    @attr({ attribute: "aria-expanded", mode: "reflect", converter: booleanConverter })
    public expanded: boolean = false;

    @attr
    public role: MenuItemRole = MenuItemRole.menuitem;

    @attr
    public checked: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        this.change();

        return true;
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public handleMenuItemClick = (e: MouseEvent): void => {
        this.change();
    };

    private change = (): void => {
        this.$emit("change");
    };
}

/* eslint-disable-next-line */
export interface MenuItem extends StartEnd {}
applyMixins(MenuItem, StartEnd);
