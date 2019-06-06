import React from "react";
import {
    CarouselClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum CarouselSlideTheme {
    light = "light",
    dark = "dark",
}

export interface CarouselSlide {
    content: (className?: string) => React.ReactNode;
    id: string;
    theme?: CarouselSlideTheme;
}

export interface CarouselManagedClasses
    extends ManagedClasses<CarouselClassNameContract> {}
export interface CarouselHandledProps extends CarouselManagedClasses {
    label: string;
    activeId?: string;
    items: CarouselSlide[];
}

export interface CarouselUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export type CarouselProps = CarouselHandledProps & CarouselUnhandledProps;
