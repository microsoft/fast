import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import Position from "./position";
import CSSPositionStyles, { CSSPositionClassNameContract } from "./position.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CSSPosition = manageJss(CSSPositionStyles)(Position);
type CSSPosition = InstanceType<typeof CSSPosition>;

export { CSSPosition };
export * from "./position.props";
