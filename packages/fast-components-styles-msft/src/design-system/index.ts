import { Direction } from "@microsoft/fast-application-utilities";
import { memoize } from "lodash-es";

export interface IDesignSystem {
    /**
     * The value typically used for backgrounds of elements
     */
    backgroundColor: string;

    /**
     * The brand color used as color accents.
     *
     */
    brandColor: string;

    /**
     * A number between 0 and 100 that represents the contrast scale value.
     */
    contrast: number;

    /**
     * The density multiplier
     */
    density: number;

    /**
     * The grid-unit that UI dimensions are derived from
     */
    designUnit: number;

    /**
     * The primary direction of the view.
     */
    direction: Direction;

    /**
     * The value typically used for foreground elements, such as text
     */
    foregroundColor: string;
}

const designSystemDefaults: IDesignSystem = {
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
    contrast: 0,
    density: 1,
    designUnit: 4,
    direction: Direction.ltr,
    foregroundColor: "#000"
};

/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults: (config: Partial<IDesignSystem>) => IDesignSystem =
    memoize(
        (config: Partial<IDesignSystem>): IDesignSystem => {
            return Object.assign({}, designSystemDefaults, config);
        }
    );

/**
 * Safely retrieves a single property from a design system
 */
export function getDesignSystemProperty(key: string): (config: IDesignSystem) => string {
    return function(config: IDesignSystem): string {
        return withDesignSystemDefaults(config)[key];
    };
}

export default designSystemDefaults;
