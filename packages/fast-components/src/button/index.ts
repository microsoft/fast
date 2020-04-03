import { customElement } from "@microsoft/fast-element";
import { Button, buttonTemplate } from "./button";
import { Anchor, anchorTemplate } from "./anchor";
import { ButtonStyles as styles } from "./button.styles";

// Button
@customElement({
    name: "fast-button",
    template: buttonTemplate,
    styles,
})
// Anchor
@customElement({
    name: "fast-anchor",
    template: anchorTemplate,
    styles,
})
export class FASTAnchor extends Anchor {}
export * from "./anchor";

/* tslint:disable-next-line:max-classes-per-file */
export class FASTButton extends Button {}
export * from "./button";

export * from "./button.styles";
