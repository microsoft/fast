import { Direction } from "@microsoft/fast-web-utilities";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import { memoize } from "lodash-es";
const designSystemDefaults = {
    direction: Direction.ltr,
};
/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults = memoize(config =>
    withDefaults(designSystemDefaults)(config)
);
