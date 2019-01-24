import * as React from "react";
import MSFTCarousel, {
    CarouselHandledProps as MSFTCarouselHandledProps,
    CarouselManagedClasses,
    CarouselProps as MSFTCarouselProps,
    CarouselUnhandledProps,
} from "./carousel";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CarouselStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Carousel = manageJss(CarouselStyles)(MSFTCarousel);
type Carousel = InstanceType<typeof Carousel>;

interface CarouselHandledProps
    extends Subtract<MSFTCarouselHandledProps, CarouselManagedClasses> {}
type CarouselProps = ManagedJSSProps<
    MSFTCarouselProps,
    CarouselClassNameContract,
    DesignSystem
>;

export {
    Carousel,
    CarouselProps,
    CarouselClassNameContract,
    CarouselHandledProps,
    CarouselUnhandledProps,
};
