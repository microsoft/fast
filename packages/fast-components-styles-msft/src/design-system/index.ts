import { Direction } from "@microsoft/fast-application-utilities";
import { memoize } from "lodash-es";

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

    /**
     * A number between 0 and 100 that represents the contrast scale value.
     */
    contrast: number;
}

const accentColor: string = "#0078D4";
const designSystemDefaults: IDesignSystem = {
    accentColor,
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: accentColor,
    direction: Direction.ltr,
    contrast: 0
};

/**
 * Ensure that all properties of the design system are assigned
 */
function safeDesignSystem(config: Partial<IDesignSystem>): IDesignSystem {
    return Object.assign({}, designSystemDefaults, config);
}
const memoizedSafeDesignSystem: (config: Partial<IDesignSystem>) => IDesignSystem = memoize(safeDesignSystem);

export { memoizedSafeDesignSystem as safeDesignSystem };
/**
 * Safely retrieves a single property from a design system
 */
export function getDesignSystemProperty(key: string): (config: IDesignSystem) => string {
    return function(config: IDesignSystem): string {
        return safeDesignSystem(config)[key];
    };
}

export default designSystemDefaults;
