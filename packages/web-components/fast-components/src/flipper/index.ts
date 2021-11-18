import {
    Flipper,
    FlipperOptions,
    flipperTemplate as template,
} from "@microsoft/fast-foundation";
import { flipperStyles as styles } from "./flipper.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Flipper} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#flipperTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-flipper>`
 */
export const fastFlipper = Flipper.compose<FlipperOptions>({
    baseName: "flipper",
    template,
    styles,
    next: `
        <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M5.53 2.86a.67.67 0 0 0 0 .94L9.73 8l-4.2 4.2a.67.67 0 1 0 .94.94l4.67-4.67a.67.67 0 0 0 0-.94L6.47 2.86a.67.67 0 0 0-.94 0Z"/>
        </svg>
    `,
    previous: `
        <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10.47 2.86c.26.26.26.68 0 .94L6.27 8l4.2 4.2a.67.67 0 1 1-.94.94L4.86 8.47a.67.67 0 0 1 0-.94l4.67-4.67a.67.67 0 0 1 .94 0Z"/>
        </svg>
    `,
});

/**
 * Base class for Flipper
 * @public
 */
export { Flipper };

export { styles as flipperStyles };
