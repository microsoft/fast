import {
    Divider as BaseSectionDivider,
    DividerClassNameContract as SectionDividerClassNameContract,
    DividerHandledProps as BaseSectionDividerHandledProps,
    DividerManagedClasses as SectionDividerManagedClasses,
    DividerProps as BaseSectionDividerProps,
    DividerRoles as SectionDividerRoles,
    DividerUnhandledProps as SectionDividerUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "../design-system";
import SectionDividerStyles from "./section-divider.styles";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const SectionDivider = manageJss(SectionDividerStyles)(BaseSectionDivider);
type SectionDivider = InstanceType<typeof SectionDivider>;

/**
 * Default role for section divider should be presentation
 */
SectionDivider.defaultProps = {
    role: SectionDividerRoles.presentation
};

interface SectionDividerHandledProps extends Subtract<BaseSectionDividerHandledProps, SectionDividerManagedClasses> {}
type SectionDividerProps = ManagedJSSProps<BaseSectionDividerProps, SectionDividerClassNameContract, DesignSystem>;

export {
    SectionDivider,
    SectionDividerProps,
    SectionDividerRoles,
    SectionDividerHandledProps,
    SectionDividerUnhandledProps,
    SectionDividerClassNameContract
};
