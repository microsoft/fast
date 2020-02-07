import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { FeatureHandledProps, FeatureProps, FeatureUnhandledProps } from "./feature.props";
import { get } from "lodash-es";
import {
    Background,
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    Paragraph,
    ParagraphProps,
    ParagraphSize
} from "@microsoft/fast-components-react-msft";
import { neutralLayerCardContainer } from "@microsoft/fast-components-styles-msft";

class Feature extends Foundation<FeatureHandledProps, FeatureUnhandledProps, {}> {
    public static displayName: string = "Feature";

    protected handledProps: HandledProps<FeatureHandledProps> = {
        action: void 0,
        badge: void 0,
        heading: void 0,
        image: void 0,
        paragraph: void 0,
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <Background
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                value={neutralLayerCardContainer}
            >
                <div className={get(this.props.managedClasses, "feature_contentContainer", "")}>
                    <div className={get(this.props.managedClasses, "feature_badge", "")}>
                        <span>{this.props.badge}</span>
                    </div>
                    <div className={get(this.props.managedClasses, "feature_content", "")}>
                        <Heading
                            {...this.getHeadingProps()}
                            className={get(this.props.managedClasses, "feature_heading", "")}
                        />
                        <Paragraph
                            {...this.getParagraphProps()}
                            className={get(this.props.managedClasses, "feature_paragraph", "")}
                        />
                        {typeof this.props.action === "function"
                            ? this.props.action(get(this.props.managedClasses, "feature_action", ""))
                            : null}
                    </div>
                </div>
                {typeof this.props.image === "function"
                    ? this.props.image(get(this.props.managedClasses, "feature_image", ""))
                    : null}
            </Background>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "feature", ""));
    }

    private getHeadingProps(): HeadingProps {
        return Object.assign({}, { tag: HeadingTag.h3, size: HeadingSize._5 }, this.props.heading);
    }

    private getParagraphProps(): ParagraphProps {
        return Object.assign({}, { size: ParagraphSize._2 }, this.props.paragraph);
    }
}

export default Feature;
export * from "./feature.props";
