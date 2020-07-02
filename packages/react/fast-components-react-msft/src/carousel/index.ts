import React from "react";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CarouselStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import carouselSchema from "./carousel.schema";
import carouselSchema2 from "./carousel.schema.2";
import MSFTCarousel, {
    CarouselManagedClasses,
    CarouselSlide,
    CarouselSlideTheme,
    CarouselState,
    CarouselUnhandledProps,
    CarouselHandledProps as MSFTCarouselHandledProps,
    CarouselProps as MSFTCarouselProps,
} from "./carousel";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Carousel = manageJss(CarouselStyles)(MSFTCarousel);
type Carousel = InstanceType<typeof Carousel>;

type CarouselHandledProps = Subtract<MSFTCarouselHandledProps, CarouselManagedClasses>;
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
    carouselSchema,
    carouselSchema2,
    CarouselState,
    CarouselSlide,
    CarouselSlideTheme,
    CarouselUnhandledProps,
};
