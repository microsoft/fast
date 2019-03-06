import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import BaseNavigation from "./navigation";
import NavigationStyles, { NavigationClassNameContract } from "./navigation.style";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Navigation = manageJss(NavigationStyles)(BaseNavigation);
type Navigation = InstanceType<typeof Navigation>;

export { Navigation };
export * from "./navigation.props";
