import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import {
    Carousel,
    CarouselClassNameContract,
    CarouselSlide,
    CarouselSlideTheme,
} from "./";
import { uniqueId } from "lodash-es";
import CarouselHero from "../../assets/carousel-hero-content";
import { HeadingSize, ParagraphSize } from "../../src";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

function itemsFiller(
    itemCount: number,
    headerContent?: string,
    paragraphContent?: string,
    extraButtons?: boolean
): CarouselSlide[] {
    const fillerArray: CarouselSlide[] = [];
    for (let i: number = 0, x: number = 1; i < itemCount; i++, x *= -1) {
        const theme: CarouselSlideTheme =
            x > 0 ? CarouselSlideTheme.light : CarouselSlideTheme.dark;
        fillerArray.push({
            id: `slide${i}`,
            theme,
            content: (className?: string): React.ReactNode => (
                <CarouselHero
                    className={className}
                    heading={
                        headerContent
                            ? {
                                  size: HeadingSize._5,
                                  children: headerContent,
                              }
                            : { children: `Slide ${i + 1}` }
                    }
                    paragraph={
                        paragraphContent
                            ? {
                                  children: paragraphContent,
                                  size: ParagraphSize._3,
                              }
                            : undefined
                    }
                    theme={theme}
                    extraButtons={extraButtons}
                />
            ),
        });
    }
    return fillerArray;
}

const carouselSequenceStylesOverrides: ComponentStyles<
    CarouselClassNameContract,
    DesignSystem
> = {
    carousel_sequenceIndicator: {
        "&::before": {
            width: "10px",
        },
    },
};

function CarouselSateHandler(props: {
    autoPlay: boolean;
    children: (
        autoPlay: boolean,
        onFocus: (event: React.FocusEvent) => void,
        onBlur: (event: React.FocusEvent) => void
    ) => JSX.Element;
}): JSX.Element {
    const [autoPlay, setAutoPlay]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState(props.autoPlay);

    function handleOnFocus(event: React.FocusEvent): void {
        setAutoPlay(false);
    }

    function handleOnBlur(event: React.FocusEvent): void {
        setAutoPlay(props.autoPlay);
    }

    return props.children(autoPlay, handleOnFocus, handleOnBlur);
}

storiesOf("Carousel", module)
    .add("Default", () => {
        function render(
            autoPlay: boolean,
            onFocus: (event: React.FocusEvent) => void,
            onBlur: (event: React.FocusEvent) => void
        ): JSX.Element {
            return (
                <Carousel
                    label="A carousel of items"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoplay={autoPlay}
                    items={itemsFiller(6)}
                />
            );
        }
        return <CarouselSateHandler autoPlay={true}>{render}</CarouselSateHandler>;
    })
    .add("No Looping and No Autoplay", () => (
        <Carousel
            label="A carousel of items"
            autoplay={false}
            loop={false}
            items={itemsFiller(8)}
        />
    ))
    .add("Looping and Autoplay", () => {
        function render(
            autoPlay: boolean,
            onFocus: (event: React.FocusEvent) => void,
            onBlur: (event: React.FocusEvent) => void
        ): JSX.Element {
            return (
                <Carousel
                    label="A carousel of items"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoplay={autoPlay}
                    loop={true}
                    items={itemsFiller(4)}
                />
            );
        }
        return <CarouselSateHandler autoPlay={true}>{render}</CarouselSateHandler>;
    })
    .add("Sequence Indicator Test with Many Items", () => {
        function render(
            autoPlay: boolean,
            onFocus: (event: React.FocusEvent) => void,
            onBlur: (event: React.FocusEvent) => void
        ): JSX.Element {
            return (
                <Carousel
                    label="A carousel of items"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoplay={autoPlay}
                    loop={true}
                    items={itemsFiller(
                        30,
                        "Sequence Indicator Test",
                        "The Sequence Indicators Container should not be full width and not cover up any actions that are in the content corners. If the individual Indicator's widths are not reduced, as they are here, the container will be too wide and cover up the buttons in the lower corners.",
                        true
                    )}
                    jssStyleSheet={carouselSequenceStylesOverrides}
                />
            );
        }
        return <CarouselSateHandler autoPlay={true}>{render}</CarouselSateHandler>;
    });
