import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Carousel, CarouselProps } from "./index";
import Documentation from "./.tmp/documentation";
import { Slide, SlideTheme } from "./carousel.props";
import { CallToActionAppearance } from "../call-to-action";
import { uniqueId } from "lodash-es";
import schema from "./carousel.schema.json";
import carouselHeroContentSchema from "../../app/components/carousel-hero-content.schema.json";
import carouselDarkImageContentSchema from "../../app/components/carousel-dark-image-content.schema.json";
import carouselLightImageContentSchema from "../../app/components/carousel-light-image-content.schema.json";

const heroContentProps: object = {
    props: {
        heading: {
            children: "Heading text",
        },
        paragraph: {
            children: "Hero paragraph test text",
        },
        callToAction: {
            children: "Call to action",
            href: "#",
            appearance: CallToActionAppearance.primary,
        },
        image: {
            src: "http://placehold.it/1399x600/2F2F2F/171717",
            alt: "Placeholder image",
        },
    },
};

const darkImageProps: object = {
    props: {
        image: {
            src: "http://placehold.it/1399x600/2F2F2F/171717",
            alt: "Placeholder image",
        },
    },
};

const detailTabItem: Slide[] = [
    {
        content: {
            id: carouselHeroContentSchema.id,
            heroContentProps,
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            darkImageProps,
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselLightImageContentSchema.id,
            props: {
                image: {
                    src: "http://placehold.it/1399x600/DDD/222",
                    alt: "Placeholder image",
                },
            },
        } as any,
        id: uniqueId(),
        theme: SlideTheme.light,
    },
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            darkImageProps,
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            heroContentProps,
        } as any,
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
];

const singleTabItem: Slide[] = [
    {
        content: {
            id: carouselDarkImageContentSchema.id,
            darkImageProps,
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
            label: "A carousel of items",
            items: detailTabItem,
            activeId: detailTabItem[2].id,
        },
        {
            label: "A single slide carousel",
            items: singleTabItem,
        } as any,
    ],
} as ComponentFactoryExample<CarouselProps>;
