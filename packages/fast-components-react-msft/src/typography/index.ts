import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ITypographyClassNameContract,
    ITypographyHandledProps as IBaseTypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    Typography as BaseTypography,
    TypographyProps as BaseTypographyProps,
    TypographySize,
    TypographyTag
} from "@microsoft/fast-components-react-base";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TypographyStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Typography = manageJss(TypographyStyles)(BaseTypography);
type Typography = InstanceType<typeof Typography>;

interface ITypographyHandledProps extends Subtract<IBaseTypographyHandledProps, ITypographyManagedClasses> {}
type TypographyProps = ManagedJSSProps<BaseTypographyProps, ITypographyClassNameContract, IDesignSystem>;

export {
    ITypographyClassNameContract,
    ITypographyHandledProps,
    ITypographyUnhandledProps,
    Typography,
    TypographyProps,
    TypographySize,
    TypographyTag
};
