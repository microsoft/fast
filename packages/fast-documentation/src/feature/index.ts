import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "../design-system";
import FeatureStyles from "./feature.style";
import BaseFeature, {
    FeatureClassNameContract,
    FeatureHandledProps as BaseFeatureHandledProps,
    FeatureManagedClasses,
    FeatureProps as BaseFeatureProps,
    FeatureUnhandledProps
} from "./feature";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Feature = manageJss(FeatureStyles)(BaseFeature);
type Feature = InstanceType<typeof Feature>;

interface FeatureHandledProps extends Subtract<BaseFeatureHandledProps, FeatureManagedClasses> {}
type FeatureProps = ManagedJSSProps<BaseFeatureProps, FeatureClassNameContract, DesignSystem>;

export { Feature, FeatureProps, FeatureClassNameContract, FeatureHandledProps, FeatureUnhandledProps };
