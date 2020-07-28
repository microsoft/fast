import { customElement } from "@microsoft/fast-element";
import {
    MockButton,
    MockUi,
    MockUiTemplate as template,
} from "@microsoft/fast-foundation";
import { MockUiStyles as styles } from "./mock-ui.styles";
import { FASTButton } from "../button"; // ensure FASTButton exists

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
export class FASTMockUi extends MockUi {
    addButton = (buttonData: MockButton): FASTButton => {
        const newButton = document.createElement("fast-button") as FASTButton;
        newButton.textContent = buttonData.name;
        newButton.id = buttonData.id;
        newButton.style.width = `${buttonData.width}px`;
        newButton.style.height = `${buttonData.height}px`;
        return newButton;
    };
}
