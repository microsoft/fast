import React from "react";
import {
    CarouselClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

/**
 * The carousel slide theme
 */
export enum CarouselSlideTheme {
    light = "light",
    dark = "dark",
}

/**
 * The carousel slide interface
 */
export interface CarouselSlide {
    content: (className?: string) => React.ReactNode;
    id: string;
    theme?: CarouselSlideTheme;
}

/**
 * The carousel state interface
 */
export interface CarouselState {
    /**
     * Holds the active tab id to share with other controls
     */
    activeId: string;
}

/**
 * The carousel managed clsases interface
 */
export type CarouselManagedClasses = ManagedClasses<CarouselClassNameContract>;

/**
 * The carousel prop interface
 */
export interface CarouselHandledProps extends CarouselManagedClasses {
    /**
     * An accessible label for the carousel
     */
    label: string;

    /**
     * The carousel activeId
     */
    activeId?: string;

    /**
     * Autoplay the carousel
     */
    autoplay?: boolean;

    /**
     * The autoplay interval in milliseconds
     */
    autoplayInterval?: number;

    /**
     * The callback which is fired when the active id is changed
     */
    onActiveIdUpdate?: (activeId: string, isAutoplay?: boolean) => void;

    /**
     * The carousel items
     */
    items: CarouselSlide[];

    /**
     * Loop the carousel
     */
    loop?: boolean;

    /**
     * The carousel next flipper
     */
    nextFlipper?: (
        onClick: (e?: React.MouseEvent<HTMLElement>) => void,
        className?: string
    ) => React.ReactNode;

    /**
     * The carousel previous flipper
     */
    previousFlipper?: (
        onClick: (e?: React.MouseEvent<HTMLElement>) => void,
        className?: string
    ) => React.ReactNode;
}

export type CarouselUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export type CarouselProps = CarouselHandledProps & CarouselUnhandledProps;
