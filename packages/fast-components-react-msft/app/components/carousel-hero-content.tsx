import * as React from "react";
import {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    Image,
    ImageProps,
    Paragraph,
    ParagraphProps,
    ParagraphSize,
} from "../../src/index";

export interface CarouselHeroContentProps {
    heading?: HeadingProps;
    paragraph?: ParagraphProps;
    callToAction?: CallToActionProps;
    image?: ImageProps;
    className?: string;
}

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
                            children={this.props.heading.children}
                        />
                        <Paragraph
                            size={ParagraphSize._1}
                            children={"Sample hero paragraph text"}
                        />
                        <CallToAction
                            style={{ marginTop: "16px" }}
                            appearance={this.props.callToAction.appearance}
                            children={this.props.callToAction.children}
                            href={this.props.callToAction.href}
                        />
                    </div>
                </div>
                <Image src={this.props.image.src} alt={this.props.image.alt} />
            </div>
        );
    }
}
