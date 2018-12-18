import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TypographyHandledProps,
    TypographyManagedClasses,
    TypographyProps,
    TypographySize,
    TypographyTag,
    TypographyUnhandledProps,
} from "./typography.props";
import {
    ManagedClasses,
    TypographyClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

class Typography extends Foundation<
    TypographyHandledProps,
    TypographyUnhandledProps,
    {}
> {
    public static defaultProps: Partial<TypographyProps> = {
        tag: TypographyTag.p,
    };

    public static displayName: string = "Typography";

    protected handledProps: HandledProps<TypographyHandledProps> = {
        managedClasses: void 0,
        tag: void 0,
        size: void 0,
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): any {
        return this.generateHTMLTag();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<
        | HTMLHeadingElement
        | HTMLParagraphElement
        | HTMLSpanElement
        | HTMLTableCaptionElement
    > {
        return (
            <this.tag {...this.unhandledProps()} className={this.generateClassNames()}>
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const classes: string = this.props.size
            ? get(this.props, `managedClasses.typography__${this.props.size}`, "")
            : get(this.props, "managedClasses.typography__1", "");

        return super.generateClassNames(
            `${get(this.props, "managedClasses.typography", "")} ${classes}`
        );
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        return TypographyTag[this.props.tag] || TypographyTag.p;
    }
}

export default Typography;
export * from "./typography.props";
export { TypographyClassNameContract };
