import {
    galleryPanelTemplate as template,
    GalleryPanel,
} from "@microsoft/fast-foundation";
import { galleryPanelStyles as styles } from "./gallery-panel.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#GalleryPanel} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#galleryPanelTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-gallery-panel>`
 */
export const fastGalleryPanel = GalleryPanel.compose({
    baseName: "gallery-panel",
    template,
    styles,
    shadowOptions: null,
});

/**
 * Base class for Gallery Panel
 * @public
 */
export { GalleryPanel };

export { styles as galleryPanelStyles };
