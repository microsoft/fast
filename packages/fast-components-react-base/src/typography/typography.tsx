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
import { IManagedClasses, ITypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Typography extends Foundation<ITypographyHandledProps & IManagedClasses<ITypographyClassNameContract>, ITypographyUnhandledProps, {}> {
    public static defaultProps: Partial<ITypographyHandledProps> = {
        tag: TypographyTag.p
    };

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

    protected generateClassNames(): string {
        return super.generateClassNames(this.getManagedClassName());
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        switch (this.props.tag) {
            case TypographyTag.caption:
                return "caption";
            case TypographyTag.h1:
                return "h1";
            case TypographyTag.h2:
                return "h2";
            case TypographyTag.h3:
                return "h3";
            case TypographyTag.h4:
                return "h4";
            case TypographyTag.h5:
                return "h5";
            case TypographyTag.h6:
                return "h6";
            case TypographyTag.span:
                return "span";
            case TypographyTag.p:
            default:
                return "p";
        }
    }

    /**
     * Gets managed class names based on props
     */
    private getManagedClassName(): string {
        switch (this.props.typeLevel) {
            default:
            case TypeLevel._1:
                return get(this.props, "managedClasses.typography_1");
            case TypeLevel._2:
                return get(this.props, "managedClasses.typography_2");
            case TypeLevel._3:
                return get(this.props, "managedClasses.typography_3");
            case TypeLevel._4:
                return get(this.props, "managedClasses.typography_4");
            case TypeLevel._5:
                return get(this.props, "managedClasses.typography_5");
            case TypeLevel._6:
                return get(this.props, "managedClasses.typography_6");
            case TypeLevel._7:
                return get(this.props, "managedClasses.typography_7");
            case TypeLevel._8:
                return get(this.props, "managedClasses.typography_8");
            case TypeLevel._9:
                return get(this.props, "managedClasses.typography_9");
        }
    }
}

export default Typography;
export * from "./typography.props";
export { ITypographyClassNameContract };
