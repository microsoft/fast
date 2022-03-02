import { attr, customElement, FASTElement } from "@microsoft/fast-element";
import { welcomeStyles as styles } from "./welcome.styles";
import { welcomeTemplate as template } from "./welcome.template";

export enum Theme {
    dark = "dark",
    light = "light",
}

/**
 * A Custom HTML Element.
 *
 * @public
 */
@customElement({ name: "fast-welcome", template, styles })
export class Welcome extends FASTElement {
    /**
     * Indicates what the theme should be.
     *
     * @public
     * @remarks
     * HTML Attribute: theme
     */
    @attr()
    public theme: string = Theme.light;
}
