import { storiesOf } from "@storybook/react";
import React from "react";
import { Carousel, CarouselSlideTheme } from "./";
import { uniqueId } from "lodash-es";
import CarouselHero from "../../assets/carousel-hero-content";
import { HeadingSize, ParagraphSize } from "../../src";

function itemsFiller(
    itemCount: number,
    headerContent?: string,
    paragraphContent?: string,
    extraButtons?: boolean
): any[] {
    const fillerArray: any[] = [];
    for (let i: number = 0, x: number = 1; i < itemCount; i++, x *= -1) {
        const theme: any = x > 0 ? CarouselSlideTheme.light : CarouselSlideTheme.dark;
        fillerArray.push({
            id: uniqueId(),
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

const carouselSequenceStylesOverrides: any = {
    carousel_sequenceIndicator: {
        "&::before": {
            width: "10px",
        },
    },
};

storiesOf("Carousel", module)
    .add("Default", () => (
        <Carousel label="A carousel of items" autoplay={true} items={itemsFiller(6)} />
    ))
    .add("No Looping and No Autoplay", () => (
        <Carousel
            label="A carousel of items"
            autoplay={false}
            loop={false}
            items={itemsFiller(8)}
        />
    ))
    .add("Looping and Autoplay", () => (
        <Carousel
            label="A carousel of items"
            autoplay={true}
            loop={true}
            items={itemsFiller(4)}
        />
    ))
    .add("Sequence Indicator Test with Many Items", () => (
        <Carousel
            label="A carousel of items"
            autoplay={true}
            loop={true}
            items={itemsFiller(
                30,
                "Sequence Indicator Test",
                "The Sequence Indicators Container should not be full width and not cover up any actions that are in the content corners. If the individual Indicator's widths are not reduced, as they are here, the container will be too wide and cover up the buttons in the lower corners.",
                true
            )}
            jssStyleSheet={carouselSequenceStylesOverrides}
        />
    ));
