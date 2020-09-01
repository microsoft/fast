import manageJss from "@microsoft/fast-jss-manager-react";
import Color from "./color";
import CSSColorStyles from "./color.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const CSSColor = manageJss(CSSColorStyles)(Color);
type CSSColor = InstanceType<typeof CSSColor>;

export { CSSColor };
export * from "./color.props";
