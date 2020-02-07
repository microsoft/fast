import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ContentPlacementHandledProps, ContentPlacementUnhandledProps } from "./content-placement.props";
import { get } from "lodash-es";
import {
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    Paragraph,
    ParagraphProps,
    ParagraphSize
} from "@microsoft/fast-components-react-msft";

class ContentPlacement extends Foundation<ContentPlacementHandledProps, ContentPlacementUnhandledProps, {}> {
    public static displayName: string = "ContentPlacement";

    protected handledProps: HandledProps<ContentPlacementHandledProps> = {
        action: void 0,
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
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <div className={get(this.props.managedClasses, "contentPlacement_contentContainer", "")}>
                    <Heading
                        {...this.getHeadingProps()}
                        className={get(this.props.managedClasses, "contentPlacement_heading", "")}
                    />
                    <Paragraph
                        {...this.getParagraphProps()}
                        className={get(this.props.managedClasses, "contentPlacement_paragraph", "")}
                    />
                    {typeof this.props.action === "function"
                        ? this.props.action(get(this.props.managedClasses, "contentPlacement_action", ""))
                        : null}
                </div>
                {typeof this.props.image === "function"
                    ? this.props.image(get(this.props.managedClasses, "contentPlacement_image", ""))
                    : null}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "contentPlacement", ""));
    }

    private getHeadingProps(): HeadingProps {
        return Object.assign({}, { tag: HeadingTag.h3, size: HeadingSize._5 }, this.props.heading);
    }

    private getParagraphProps(): ParagraphProps {
        return Object.assign({}, { size: ParagraphSize._3 }, this.props.paragraph);
    }
}

export default ContentPlacement;
export * from "./content-placement.props";
