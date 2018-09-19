import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import { Foundation, HandledProps, TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
import { CaptionSize, CaptionTag, ICaptionHandledProps, ICaptionUnhandledProps } from "./caption.props";
import { ICaptionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { Typography } from "../typography";

class Caption extends Foundation<ICaptionHandledProps & IManagedClasses<ICaptionClassNameContract>, ICaptionUnhandledProps, {}> {
    public static defaultProps: Partial<ICaptionHandledProps> = {
        tag: CaptionTag.p,
        size: CaptionSize._1
    };

    public static displayName: string = "Caption";

    protected handledProps: HandledProps<ICaptionHandledProps & IManagedClasses<ICaptionClassNameContract>> = {
        size: void 0,
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
                size={this.size()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </Typography>
        );
    }

    protected generateClassNames(): string {
        const classes: string =
            `${get(this.props, `managedClasses.caption`)} ${get(this.props, `managedClasses.caption__${this.props.size}`)}`;

        return super.generateClassNames(classes);
    }

    private size(): TypographySize {
        return this.props.size === CaptionSize._2
            ? TypographySize._9
            : TypographySize._8;
    }
}

export default Caption;
export * from "./caption.props";
export { ICaptionClassNameContract };
