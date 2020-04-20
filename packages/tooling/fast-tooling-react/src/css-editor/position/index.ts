import manageJss from "@microsoft/fast-jss-manager-react";
import Position from "./position";
import CSSPositionStyles from "./position.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const CSSPosition = manageJss(CSSPositionStyles)(Position);
type CSSPosition = InstanceType<typeof CSSPosition>;

export { CSSPosition };
export * from "./position.props";
