import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Carousel, CarouselProps } from "./index";
import schema from "./carousel.schema.json";
import Documentation from "./.tmp/documentation";
import {
    CallToAction,
    CallToActionAppearance,
    Heading,
    HeadingSize,
    HeadingTag,
    Image,
    Paragraph,
    ParagraphSize,
} from "../index";
import { Slide, SlideTheme } from "./carousel.props";
import { get, uniqueId } from "lodash-es";
import carouselHeroContentSchema from "../../app/components/carousel-hero-content.schema.json";

function contentOne(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <Image
                src={"http://placehold.it/1399x600/2F2F2F/171717"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

function contentTwo(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <Image
                src={"http://placehold.it/1399x600/111/666"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

function contentThree(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <Image
                src={"http://placehold.it/1399x600/666/EEE"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

function contentFour(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <Image
                src={"http://placehold.it/1399x600/DDD/222"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

function mockHero(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <div
                style={{
                    justifyContent: "center",
                    width: "100%",
                    position: "absolute",
                    top: "0",
                    height: "100%",
                    alignItems: "flex-end",
                    display: "flex",
                    JustifyContent: "center",
                    left: "0",
                    right: "0",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        marginBottom: "40px",
                        padding: "16px",
                        background: "hsla(0,0%,100%,.9)",
                        width: "40%",
                        textAlign: "center",
                    }}
                >
                    <Heading
                        tag={HeadingTag.h2}
                        size={HeadingSize._3}
                        children={"Hero title"}
                    />
                    <Paragraph
                        size={ParagraphSize._1}
                        children={"Sample hero paragraph text"}
                    />
                    <CallToAction
                        style={{ marginTop: "16px" }}
                        appearance={CallToActionAppearance.primary}
                        children={"Call to action"}
                        href={"#"}
                    />
                </div>
            </div>
            <Image
                src={"http://placehold.it/1399x600/2F2F2F/171717"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

const detailTabItem: Slide[] = [
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
        id: uniqueId(),
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
        id: uniqueId(),
        theme: SlideTheme.dark,
    },
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
        id: uniqueId(),
        theme: SlideTheme.light,
    },
];

const singleTabItem: Slide[] = [
    {
        content: {
            id: carouselHeroContentSchema.id,
            props: {},
        },
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
