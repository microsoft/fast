import * as React from "react";
import {
    CarouselClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { TabsItem } from "@microsoft/fast-components-react-base";

export enum SlideTheme {
    light = "light",
    dark = "dark",
}

export interface Slide extends TabsItem {
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
