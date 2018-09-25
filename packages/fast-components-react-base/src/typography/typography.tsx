import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import {
    ITypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    TypeLevel,
    TypographyTag
} from "./typography.props";
import { IManagedClasses, ITypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

class Typography extends Foundation<
    ITypographyHandledProps & IManagedClasses<ITypographyClassNameContract>,
    ITypographyUnhandledProps,
    {}
> {
    public static defaultProps: Partial<ITypographyHandledProps> = {
        tag: TypographyTag.p
    };

    public static displayName: string = "Typography";

    protected handledProps: HandledProps<ITypographyHandledProps & IManagedClasses<ITypographyClassNameContract>> = {
        managedClasses: void 0,
        tag: void 0,
        typeLevel: void 0
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return this.generateHTMLTag();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLTableCaptionElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                {this.props.children}
            </this.tag>
        );
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        const classes: string = this.props.typeLevel ?
            get(this.props, `managedClasses.typography_${this.props.typeLevel}`) : get(this.props, "managedClasses.typography_1");

        return super.generateClassNames(classes);
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
export { ITypographyClassNameContract };
