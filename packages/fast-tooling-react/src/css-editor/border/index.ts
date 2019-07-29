import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Border from "./border";
import CSSBorderStyles, { CSSBorderClassNameContract } from "./border.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSBorder = manageJss(CSSBorderStyles)(Border);
type CSSBorder = InstanceType<typeof CSSBorder>;

export { CSSBorder };
export * from "./border.props";
