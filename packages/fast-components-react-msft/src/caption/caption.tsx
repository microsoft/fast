import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";
import { CaptionLevel, CaptionTag, ICaptionHandledProps, ICaptionUnhandledProps } from "./caption.props";
import { ICaptionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { Typography } from "../typography";

class Caption extends Foundation<ICaptionHandledProps & IManagedClasses<ICaptionClassNameContract>, ICaptionUnhandledProps, {}> {
    public static defaultProps: Partial<ICaptionHandledProps> = {
        tag: CaptionTag.p,
        level: CaptionLevel._1
    };

    public static displayName: string = "Caption";

    protected handledProps: HandledProps<ICaptionHandledProps & IManagedClasses<ICaptionClassNameContract>> = {
        level: void 0,
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement> {
        return (
            <Typography
                {...this.unhandledProps()}
                tag={TypographyTag[this.props.tag]}
                typeLevel={this.level()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    protected generateClassNames(): string {
        const classes: string =
            `${get(this.props, `managedClasses.caption`)} ${get(this.props, `managedClasses.caption_${this.props.level}`)}`;

        return super.generateClassNames(classes);
    }

    private level(): TypeLevel {
        return this.props.level === CaptionLevel._2
            ? TypeLevel._9
            : TypeLevel._8;
    }
}

export default Caption;
export * from "./caption.props";
export { ICaptionClassNameContract };
