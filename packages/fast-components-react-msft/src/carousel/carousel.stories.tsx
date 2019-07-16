import { storiesOf } from "@storybook/react";
import React from "react";
import { Carousel, CarouselSlideTheme } from "./";
import { uniqueId } from "lodash-es";
import CarouselHero from "../../assets/carousel-hero-content";

storiesOf("Carousel", module).add("Default", () => (
    <Carousel
        label="A carousel of items"
        autoplay={true}
        items={[
            {
                id: uniqueId(),
                theme: CarouselSlideTheme.light,
                content: (className?: string): React.ReactNode => (
                    <CarouselHero
                        className={className}
                        heading={{ children: "slide one" }}
                        theme={CarouselSlideTheme.light}
                    />
                ),
            },
            {
                id: uniqueId(),
                theme: CarouselSlideTheme.dark,
                content: (className?: string): React.ReactNode => (
                    <CarouselHero
                        className={className}
                        heading={{ children: "slide two" }}
                        theme={CarouselSlideTheme.dark}
                    />
                ),
            },
            {
                id: uniqueId(),
                theme: CarouselSlideTheme.light,
                content: (className?: string): React.ReactNode => (
                    <CarouselHero
                        className={className}
                        heading={{ children: "slide three" }}
                        theme={CarouselSlideTheme.light}
                    />
                ),
            },
            {
                id: uniqueId(),
                theme: CarouselSlideTheme.dark,
                content: (className?: string): React.ReactNode => (
                    <CarouselHero
                        className={className}
                        heading={{ children: "slide four" }}
                        theme={CarouselSlideTheme.dark}
                    />
                ),
            },
        ]}
    />
));
