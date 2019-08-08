import React from "react";
import ReactDOM from "react-dom";
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
import { DisplayNamePrefix } from "../utilities";
import { classNames } from "@microsoft/fast-web-utilities";

class Typography extends Foundation<
    TypographyHandledProps,
    TypographyUnhandledProps,
    {}
> {
    public static defaultProps: Partial<TypographyProps> = {
        tag: TypographyTag.p,
        size: TypographySize._1,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Typography`;

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
        const managedClasses: TypographyClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                managedClasses.typography,
                managedClasses[`typography__${this.props.size}`]
            )
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
