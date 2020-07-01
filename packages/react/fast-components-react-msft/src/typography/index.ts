import React from "react";
import {
    Typography as BaseTypography,
    TypographyHandledProps as BaseTypographyHandledProps,
    TypographyProps as BaseTypographyProps,
    TypographyClassNameContract,
    TypographyManagedClasses,
    TypographySize,
    TypographyTag,
    TypographyUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TypographyStyles } from "@microsoft/fast-components-styles-msft";
import typographySchema from "./typography.schema";
import typographySchema2 from "./typography.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Typography = manageJss(TypographyStyles)(BaseTypography);
type Typography = InstanceType<typeof Typography>;

type TypographyHandledProps = Subtract<
    BaseTypographyHandledProps,
    TypographyManagedClasses
>;
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
    typographySchema,
    typographySchema2,
    /**
     * @deprecated
     */
    typographySchema as typograophySchema,
    TypographySize,
    TypographyTag,
};
