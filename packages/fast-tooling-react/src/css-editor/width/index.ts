import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Width from "./width";
import CSSWidthStyles, { CSSWidthClassNameContract } from "./width.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSWidth = manageJss(CSSWidthStyles)(Width);
type CSSWidth = InstanceType<typeof CSSWidth>;

export { CSSWidth };
export * from "./width.props";
