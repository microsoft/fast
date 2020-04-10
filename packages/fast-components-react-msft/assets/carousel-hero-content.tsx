import React from "react";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import {
    AccentButton,
    AccentButtonClassNameContract,
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    CarouselSlideTheme,
    Heading,
    HeadingProps,
    Image,
    ImageProps,
    Paragraph,
    ParagraphProps,
} from "../src";

export interface CarouselHeroContentProps {
    heading?: HeadingProps;
    paragraph?: ParagraphProps;
    callToAction?: CallToActionProps;
    image?: ImageProps;
    className?: string;
    theme?: CarouselSlideTheme;
    extraButtons?: boolean;
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
            alt: "Placeholder image",
        },
        callToAction: {
            children: "Call to action",
            href: "#",
            appearance: CallToActionAppearance.primary,
        },
        extraButtons: false,
    };

    private imageSrc: string =
        this.props.theme === CarouselSlideTheme.light
            ? "http://placehold.it/1399x600/2F2F2F/171717"
            : "http://placehold.it/1399x600/";

    private extraButtonRightStyle: ComponentStyles<
        AccentButtonClassNameContract,
        DesignSystem
    > = {
        button: {
            float: "right",
        },
    };

    private containerBackgroundColor: string =
        this.props.theme === CarouselSlideTheme.light
            ? "rgb(47,47,47)"
            : "rgb(204,204,204)";

    public render(): React.ReactNode {
        return (
            <div
                className={this.props.className}
                style={{ backgroundColor: this.containerBackgroundColor }}
            >
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
                            tag={this.props.heading.tag}
                            size={this.props.heading.size}
                            children={this.props.heading.children}
                        />
                        <Paragraph
                            size={this.props.paragraph.size}
                            children={this.props.paragraph.children}
                        />
                        <CallToAction
                            style={{ marginTop: "16px" }}
                            appearance={this.props.callToAction.appearance}
                            children={this.props.callToAction.children}
                            href={this.props.callToAction.href}
                        />
                    </div>
                </div>
                <Image src={this.imageSrc} alt={this.props.image.alt} />
                {this.props.extraButtons && (
                    <React.Fragment>
                        <AccentButton jssStyleSheet={this.extraButtonRightStyle}>
                            Right Test
                        </AccentButton>
                        <AccentButton>Left Test</AccentButton>
                    </React.Fragment>
                )}
            </div>
        );
    }
}
