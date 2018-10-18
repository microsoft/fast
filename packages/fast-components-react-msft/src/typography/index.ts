import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Typography as BaseTypography,
    TypographyClassNameContract,
    TypographyHandledProps as BaseTypographyHandledProps,
    TypographyManagedClasses,
    TypographyProps as BaseTypographyProps,
    TypographySize,
    TypographyTag,
    TypographyUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TypographyStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Typography = manageJss(TypographyStyles)(BaseTypography);
type Typography = typeof Typography;

interface TypographyHandledProps
    extends Subtract<BaseTypographyHandledProps, TypographyManagedClasses> {}
type TypographyProps = ManagedJSSProps<
    BaseTypographyProps,
    TypographyClassNameContract,
    DesignSystem
>;

export {
    TypographyClassNameContract,
    TypographyHandledProps,
    TypographyUnhandledProps,
    Typography,
    TypographyProps,
    TypographySize,
    TypographyTag
};
