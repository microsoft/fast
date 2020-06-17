import { customElement } from "@microsoft/fast-element";
import { MockUi, MockUiTemplate as template } from "@microsoft/fast-foundation";
import { MockUiStyles as styles } from "./mock-ui.styles";

/**
 * The FAST Mock Ui Element. Implements {@link @microsoft/fast-foundation#MockUi},
 * {@link @microsoft/fast-foundation#MockUiTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-mock-ui\>
 */
@customElement({
    name: "fast-mock-ui",
    template,
    styles,
})
export class FASTMockUi extends MockUi {}
