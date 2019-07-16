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
                    />
                ),
            },
        ]}
    />
));
