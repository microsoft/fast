import { ComponentViewConfig } from "./data.props";
import {
    CallToActionAppearance,
    Carousel,
    CarouselProps,
    carouselSchema,
    CarouselSlide,
    CarouselSlideTheme,
    imageSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import { carouselHeroContentSchema } from "../../components/carousel";
import { groupSchema } from "../../../app/components/group";
import Guidance from "../../.tmp/carousel/guidance";

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
        src: "http://placehold.it/1399x600/2F2F2F/171717",
        alt: "Placeholder image",
    },
};

const lightImageProps: object = {
    props: {
        src: "http://placehold.it/1399x600/DDD/222",
        alt: "Placeholder image",
    },
};

const defaultTabItems: CarouselSlide[] = [
    {
        content: {
            id: carouselHeroContentSchema.id,
            ...heroContentProps,
        } as any,
        id: uniqueId(),
        theme: CarouselSlideTheme.dark,
    },
    {
        content: {
            id: groupSchema.id,
            props: {
                children: {
                    id: imageSchema.id,
                    ...darkImageProps,
                },
            },
        } as any,
        id: uniqueId(),
        theme: CarouselSlideTheme.dark,
    },
    {
        content: {
            id: groupSchema.id,
            props: {
                children: {
                    id: imageSchema.id,
                    ...lightImageProps,
                },
            },
        } as any,
        id: uniqueId(),
        theme: CarouselSlideTheme.light,
    },
    {
        content: {
            id: groupSchema.id,
            props: {
                children: {
                    id: imageSchema.id,
                    ...darkImageProps,
                },
            },
        } as any,
        id: uniqueId(),
        theme: CarouselSlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            ...heroContentProps,
        } as any,
        id: uniqueId(),
        theme: CarouselSlideTheme.dark,
    },
];

const carouselConfig: ComponentViewConfig<CarouselProps> = {
    schema: carouselSchema,
    component: Carousel,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                label: "A carousel of items",
                items: defaultTabItems,
                autoplay: true,
            },
        },
    ],
};

export default carouselConfig;
