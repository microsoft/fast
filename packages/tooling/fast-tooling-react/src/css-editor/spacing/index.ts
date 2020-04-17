import manageJss from "@microsoft/fast-jss-manager-react";
import Spacing from "./spacing";
import CSSSpacingStyles from "./spacing.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const CSSSpacing = manageJss(CSSSpacingStyles)(Spacing);
type CSSSpacing = InstanceType<typeof CSSSpacing>;

export { CSSSpacing };
export * from "./spacing.props";
