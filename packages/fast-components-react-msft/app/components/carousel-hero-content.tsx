import * as React from "react";
import {
    CallToAction,
    CallToActionAppearance,
    Heading,
    HeadingSize,
    HeadingTag,
    Image,
    Paragraph,
    ParagraphSize,
} from "../../src/index";

/**
 * A stand-in a mock hero
 */
export default class CarouselHeroContent extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <div {...this.props}>
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
}
