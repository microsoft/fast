import React from "react";
import {
    CallToAction,
    CallToActionAppearance,
    Heading,
    HeadingSize,
    HeadingTag,
    Image,
    Paragraph,
    ParagraphSize,
} from "@microsoft/fast-components-react-msft";
import { CarouselHeroContentProps } from "./carousel-hero-content.props";

/**
 * A stand-in a mock hero
 */
export default class CarouselHeroContent extends React.Component<
    CarouselHeroContentProps,
    {}
> {
    public static defaultProps: CarouselHeroContentProps = {
        heading: {
            children: "Heading text",
        },
        paragraph: {
            children: "Hero paragraph test text",
        },
        image: {
            src: "http://placehold.it/1399x600/2F2F2F/171717",
            alt: "Placeholder image",
        },
        callToAction: {
            children: "Call to action",
            href: "#",
            appearance: CallToActionAppearance.primary,
        },
    };

    public render(): React.ReactNode {
        return (
            <div className={this.props.className}>
                <div
                    style={{
                        justifyContent: "center",
                        width: "100%",
                        position: "absolute",
                        top: "0",
                        height: "100%",
                        alignItems: "flex-end",
                        display: "flex",
                        left: "0",
                        right: "0",
                        overflow: "hidden",
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
                            {...this.props.heading}
                        />
                        <Paragraph
                            size={ParagraphSize._1}
                            children={"Sample hero paragraph text"}
                        />
                        <CallToAction
                            style={{ marginTop: "16px" }}
                            {...this.props.callToAction}
                        />
                    </div>
                </div>
                <Image {...this.props.image} alt={"Placeholder image"} />
            </div>
        );
    }
}
