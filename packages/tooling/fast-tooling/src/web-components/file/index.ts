import { File } from "./file";
import { FileTemplate as template } from "./file.template";
import { FileStyles as styles } from "./file.styles";

/**
 *
 * @public
 * @remarks
 * HTML Element: \<color-picker\>
 */
export const fastToolingFile = File.compose({
    baseName: "file",
    template,
    styles,
});
