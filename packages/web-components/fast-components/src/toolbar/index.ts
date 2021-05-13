import { customElement } from "@microsoft/fast-element";
import { Toolbar, ToolbarTemplate } from "@microsoft/fast-foundation";
import { ToolbarStyles } from "./toolbar.styles";

/**
 * The FAST toolbar Custom Element. Implements {@link @microsoft/fast-foundation#Toolbar},
 * {@link @microsoft/fast-foundation#ToolbarTemplate}
 *
 * @public
 * @remarks
 * HTML Element: `<fast-toolbar>`
 *
 */
@customElement({
    name: "fast-toolbar",
    template: ToolbarTemplate,
    styles: ToolbarStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTToolbar extends Toolbar {}

/**
 * Styles for Toolbar.
 * @public
 */
export { ToolbarStyles };
