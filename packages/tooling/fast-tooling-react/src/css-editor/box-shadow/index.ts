import manageJss from "@microsoft/fast-jss-manager-react";
import BoxShadow from "./box-shadow";
import BoxShadowStyles from "./box-shadow.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const CSSBoxShadow = manageJss(BoxShadowStyles)(BoxShadow);
type CSSBoxShadow = InstanceType<typeof CSSBoxShadow>;

export { CSSBoxShadow };
export * from "./box-shadow.props";
