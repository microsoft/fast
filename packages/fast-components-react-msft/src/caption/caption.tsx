import React from "react";
import ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import {
    CaptionHandledProps,
    CaptionProps,
    CaptionSize,
    CaptionTag,
    CaptionUnhandledProps,
} from "./caption.props";
import { Typography } from "../typography";

class Caption extends Foundation<CaptionHandledProps, CaptionUnhandledProps, {}> {
    public static defaultProps: Partial<CaptionProps> = {
        tag: CaptionTag.p,
        size: CaptionSize._1,
    };

    public static displayName: string = "Caption";

    protected handledProps: HandledProps<CaptionHandledProps> = {
        size: void 0,
        managedClasses: void 0,
        tag: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<
        HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement
    > {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                size={this.size()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    protected generateClassNames(): string {
        const classes: string = `${get(this.props, `managedClasses.caption`)} ${get(
            this.props,
            `managedClasses.caption__${this.props.size}`
        )}`;

        return super.generateClassNames(classes);
    }

    private size(): TypographySize {
        return this.props.size === CaptionSize._2 ? TypographySize._9 : TypographySize._8;
    }
}

export default Caption;
export * from "./caption.props";
