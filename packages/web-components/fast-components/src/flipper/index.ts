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
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.52876 2.86193C5.26841 3.12228 5.26841 3.54439 5.52876 3.80474L9.72403 8L5.52876 12.1953C5.26841 12.4556 5.26841 12.8777 5.52876 13.1381C5.78911 13.3984 6.21122 13.3984 6.47157 13.1381L11.1382 8.4714C11.3986 8.21107 11.3986 7.78893 11.1382 7.5286L6.47157 2.86193C6.21122 2.60158 5.78911 2.60158 5.52876 2.86193Z"/>
    </svg>
    `,
    previous: `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.4712 2.86193C10.7316 3.12228 10.7316 3.54439 10.4712 3.80474L6.27598 8L10.4712 12.1953C10.7316 12.4556 10.7316 12.8777 10.4712 13.1381C10.2109 13.3984 9.78877 13.3984 9.52844 13.1381L4.86176 8.4714C4.60142 8.21107 4.60142 7.78893 4.86176 7.5286L9.52844 2.86193C9.78877 2.60158 10.2109 2.60158 10.4712 2.86193Z"/>
    </svg>
    `,
});

/**
 * Base class for Flipper
 * @public
 */
export { Flipper };

export { styles as flipperStyles };
