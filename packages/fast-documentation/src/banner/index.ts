import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "../design-system";
import BannerStyles from "./banner.style";
import BaseBanner, {
    BannerClassNameContract,
    BannerHandledProps as BaseBannerHandledProps,
    BannerManagedClasses,
    BannerProps as BaseBannerProps,
    BannerUnhandledProps
} from "./banner";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Banner = manageJss(BannerStyles)(BaseBanner);
type Banner = InstanceType<typeof Banner>;

interface BannerHandledProps extends Subtract<BaseBannerHandledProps, BannerManagedClasses> {}
type BannerProps = ManagedJSSProps<BaseBannerProps, BannerClassNameContract, DesignSystem>;

export { Banner, BannerProps, BannerClassNameContract, BannerHandledProps, BannerUnhandledProps };
