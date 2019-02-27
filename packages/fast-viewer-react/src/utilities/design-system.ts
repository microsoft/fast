import { Direction } from "@microsoft/fast-web-utilities";
import { memoize } from "lodash-es";

export interface DesignSystem {
    /**
     * The primary direction of the view.
     */
    direction: Direction;
}

const designSystemDefaults: DesignSystem = {
    direction: Direction.ltr,
};

/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults: (
    config: Partial<DesignSystem>
) => DesignSystem = memoize(
    (config: Partial<DesignSystem>): DesignSystem => {
        return Object.assign({}, designSystemDefaults, config);
    }
);
