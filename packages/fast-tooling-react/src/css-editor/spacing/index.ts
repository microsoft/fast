import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Spacing from "./spacing";
import CSSSpacingStyles, { CSSSpacingClassNameContract } from "./spacing.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSSpacing = manageJss(CSSSpacingStyles)(Spacing);
type CSSSpacing = InstanceType<typeof CSSSpacing>;

export { CSSSpacing };
export * from "./spacing.props";
