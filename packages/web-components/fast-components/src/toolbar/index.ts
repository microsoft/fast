import {
    DI,
    Toolbar as FoundationToolbar,
    toolbarTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, NeutralFillCard } from "../design-tokens";
import { ToolbarStyles as styles } from "./toolbar.styles";

/**
 * @internal
 */
export class Toolbar extends FoundationToolbar {
    connectedCallback() {
        super.connectedCallback();
        fillColor.setValueFor(this, (target: HTMLElement) => {
            return DI.findResponsibleContainer(target).get(NeutralFillCard)(
                target,
                fillColor.getValueFor(this.parentElement!)
            );
        });
    }
}

/**
 * The FAST toolbar Custom Element. Implements {@link @microsoft/fast-foundation#Toolbar},
 * {@link @microsoft/fast-foundation#ToolbarTemplate}
 *
 * @public
 * @remarks
 * HTML Element: `<fast-toolbar>`
 *
 */
export const fastToolbar = Toolbar.compose({
    baseName: "toolbar",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
/**
 * Styles for Toolbar.
 * @public
 */
export const toolbarStyles = styles;
