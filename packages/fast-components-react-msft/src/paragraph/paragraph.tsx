import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphProps,
    ParagraphSize
} from "./paragraph.props";
import { Typography } from "../typography";
import { IManagedClasses, IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

class Paragraph extends Foundation<
    IParagraphHandledProps,
    IParagraphUnhandledProps,
    {}
> {
    public static defaultProps: Partial<ParagraphProps> = {
        size: ParagraphSize._3
    };

    public static displayName: string = "Paragraph";

    protected handledProps: HandledProps<IParagraphHandledProps> = {
        size: void 0,
        managedClasses: void 0
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
        const classes: string =
            `${get(this.props, `managedClasses.paragraph`)} ${get(this.props, `managedClasses.paragraph__${this.props.size}`)}`;

        return super.generateClassNames(`${get(this.props, "managedClasses.paragraph")} ${classes}`);
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
export { IParagraphClassNameContract };
