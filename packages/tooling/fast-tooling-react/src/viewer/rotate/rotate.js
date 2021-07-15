import { Rotate as BaseRotate } from "./rotate.base";
import { Orientation } from "./rotate.props";
import manageJss from "@microsoft/fast-jss-manager-react";
import RotateStyles from "./rotate.style";
/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Rotate = manageJss(RotateStyles)(BaseRotate);
export { Orientation, Rotate };
