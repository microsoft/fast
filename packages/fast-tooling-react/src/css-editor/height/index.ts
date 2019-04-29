import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Height from "./height";
import CSSHeightStyles, { CSSHeightClassNameContract } from "./height.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSHeight = manageJss(CSSHeightStyles)(Height);
type CSSHeight = InstanceType<typeof CSSHeight>;

export { CSSHeight };
export * from "./height.props";
