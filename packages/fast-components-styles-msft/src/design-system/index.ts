import { Direction } from "@microsoft/fast-application-utilities";

export interface IDesignSystem {

    /**
     * The accent color used to bring attention to prioritized elements
     */
    accentColor: string;
   
    /**
     * The value typically used for foreground elements, such as text
     */
    foregroundColor: string;

    /**
     * The value typically used for backgrounds of elements
     */
    backgroundColor: string;

    /**
     * The brand color. This value is deprecated in lieu of accentColor
     * @deprecated
     *
     */
    brandColor: string;

    /**
     * The primary direction of the document
     */
    direction: Direction;
}

const accentColor = "#0078D4";
const designSystemDefaults: IDesignSystem = {
    accentColor,
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: accentColor,
    direction: Direction.ltr
};

export default designSystemDefaults;
