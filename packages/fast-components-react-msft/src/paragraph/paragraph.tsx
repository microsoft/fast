import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { Typography } from "../typography";
import { DisplayNamePrefix } from "../utilities";
import {
    ParagraphHandledProps,
    ParagraphProps,
    ParagraphSize,
    ParagraphUnhandledProps,
} from "./paragraph.props";

class Paragraph extends Foundation<ParagraphHandledProps, ParagraphUnhandledProps, {}> {
    public static defaultProps: Partial<ParagraphProps> = {
        size: ParagraphSize._3,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Paragraph`;

    protected handledProps: HandledProps<ParagraphHandledProps> = {
        size: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag.p}
                size={this.size}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const managedClasses: ParagraphClassNameContract = this.props.managedClasses;
        return super.generateClassNames(
            classNames(
                managedClasses.paragraph,
                managedClasses[`paragraph__${this.props.size}`]
            )
        );
    }

    /**
     * Stores size for use in render
     */
    private get size(): TypographySize {
        switch (this.props.size) {
            case ParagraphSize._1:
                return TypographySize._5;
            case ParagraphSize._2:
                return TypographySize._6;
            default:
                return TypographySize._7;
        }
    }
}

export default Paragraph;
export * from "./paragraph.props";
export { ParagraphClassNameContract };
