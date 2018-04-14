import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import {
    ILabelHandledProps,
    ILabelMangedClasses,
    ILabelUnhandledProps,
    LabelTag
} from "./label.props";
import { ILabelClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Label extends Foundation<ILabelHandledProps & IManagedClasses<ILabelClassNameContract>, React.HTMLAttributes<HTMLLabelElement>, {}> {
    public static defaultProps: Partial<ILabelHandledProps> = {
        tag: LabelTag.label
    };

    protected handledProps: HandledProps<ILabelHandledProps & IManagedClasses<ILabelClassNameContract>> = {
        children: void 0,
        managedClasses: void 0,
        tag: void 0
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
    public render(): React.ReactElement<HTMLLabelElement> {
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
        return super.generateClassNames(get(this.props, "managedClasses.label"));
    }

    /**
     * Creates tags for rendering based on href
     */
    private generateHTMLTag(): string {
        return LabelTag[this.props.tag] || LabelTag.p;
    }
}

export default Label;
export * from "./label.props";
export {ILabelClassNameContract};
