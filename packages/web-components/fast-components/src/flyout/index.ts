import { customElement } from "@microsoft/fast-element";
import { Flyout, FlyoutTemplate as template } from "@microsoft/fast-foundation";
import { FlyoutStyles as styles } from "./flyout.styles";

/**
 * The FAST Flyout Element. Implements {@link @microsoft/fast-foundation#Flyout},
 * {@link @microsoft/fast-foundation#FlyoutTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-flipper\>
 */
@customElement({
    name: "fast-flyout",
    template,
    styles,
})
export class FASTFlyout extends Flyout {}

/**
 * Styles for Flyout
 * @public
 */
export const FlyoutStyles = styles;
