import { attr, FastElement } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";

export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

export class MenuItem extends FastElement {
    @attr
    public disabled: boolean;

    @attr
    public role: MenuItemRole = MenuItemRole.menuitem;

    @attr
    public checked: boolean;

    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.$emit("click", e);
                break;
        }

        return true;
    };

    public handleMenuItemClick = (e: MouseEvent): void => {
        this.$emit("click", e);
    };
}
