import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ITypographyClassNameContract,
    ITypographyHandledProps,
    ITypographyUnhandledProps,
    Typography as BaseTypography
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TypographyStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Typography = manageJss(TypographyStyles)(BaseTypography);
type Typography = InstanceType<typeof Typography>;

export { Typography };
