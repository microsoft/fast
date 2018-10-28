import manageJss from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, default as BaseButton } from "./button";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Button = manageJss(ButtonStyles)(BaseButton);
type Button = typeof Button;

export default Button;
export * from "./button";
