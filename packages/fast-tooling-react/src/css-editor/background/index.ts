import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Background from "./background";
import CSSBackgroundStyles, { CSSBackgroundClassNameContract } from "./background.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSBackground = manageJss(CSSBackgroundStyles)(Background);
type CSSBackground = InstanceType<typeof CSSBackground>;

export { CSSBackground };
export * from "./background.props";
