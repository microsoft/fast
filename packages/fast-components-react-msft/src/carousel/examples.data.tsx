import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Carousel, CarouselProps } from "./index";
import Documentation from "./.tmp/documentation";
import { Slide, SlideTheme } from "./carousel.props";
import { uniqueId } from "lodash-es";
import schema from "./carousel.schema.json";
import carouselHeroContentSchema from "../../app/components/carousel-hero-content.schema.json";
import carouselDarkImageContentSchema from "../../app/components/carousel-dark-image-content.schema.json";
import carouselLightImageContentSchema from "../../app/components/carousel-light-image-content.schema.json";

const detailTabItem: Slide[] = [
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
    },
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselLightImageContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
        theme: SlideTheme.light,
    },
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
];

const singleTabItem: Slide[] = [
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            props: {},
        } as any,
        id: uniqueId(),
    },
];

export default {
    name: "Carousel",
    component: Carousel,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        label: "A carousel of items",
        items: detailTabItem,
    },
    data: [
        {
            label: "A set of example text content",
            items: detailTabItem,
        },
        {
            label: "A set of example text content",
            items: singleTabItem,
        } as any,
    ],
} as ComponentFactoryExample<CarouselProps>;
