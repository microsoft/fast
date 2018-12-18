import React from "react";
import {
    CarouselClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum SlideTheme {
    light = "light",
    dark = "dark",
}

export interface Slide {
    content: (className?: string) => React.ReactNode;
    id: string;
    theme?: SlideTheme;
}

export interface CarouselManagedClasses
    extends ManagedClasses<CarouselClassNameContract> {}
export interface CarouselHandledProps extends CarouselManagedClasses {
    label: string;
    activeId?: string;
    items: Slide[];
}

export interface CarouselUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export type CarouselProps = CarouselHandledProps & CarouselUnhandledProps;
