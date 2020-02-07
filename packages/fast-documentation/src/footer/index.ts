import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "../design-system";
import FooterStyles from "./footer.style";
import BaseFooter, {
    FooterClassNameContract,
    FooterHandledProps as BaseFooterHandledProps,
    FooterManagedClasses,
    FooterProps as BaseFooterProps,
    FooterUnhandledProps
} from "./footer";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Footer = manageJss(FooterStyles)(BaseFooter);
type Footer = InstanceType<typeof Footer>;

interface FooterHandledProps extends Subtract<BaseFooterHandledProps, FooterManagedClasses> {}
type FooterProps = ManagedJSSProps<BaseFooterProps, FooterClassNameContract, DesignSystem>;

export { Footer, FooterProps, FooterClassNameContract, FooterHandledProps, FooterUnhandledProps };
