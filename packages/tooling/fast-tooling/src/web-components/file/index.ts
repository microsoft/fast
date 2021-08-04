import { File } from "./file";
import { FileTemplate as template } from "./file.template";
import { FileStyles as styles } from "./file.styles";

/**
 * @alpha
 * @remarks
 * HTML Element: \<fast-tooling-file\>
 */
export const fastToolingFile = File.compose({
    baseName: "file",
    template,
    styles,
});
