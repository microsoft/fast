import * as React from "react";
import * as ReactDOM from "react-dom";
import { get, isUndefined } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ILabelHandledProps,
    ILabelManagedClasses,
    ILabelUnhandledProps,
    LabelTag
} from "./label.props";
import { ILabelClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

class Label extends Foundation<
    ILabelHandledProps & IManagedClasses<ILabelClassNameContract>,
    React.HTMLAttributes<HTMLLabelElement>,
    {}
> {
    public static displayName: string = "Label";

    public static defaultProps: Partial<ILabelHandledProps> = {
        tag: LabelTag.label
    };

    protected handledProps: HandledProps<ILabelHandledProps & IManagedClasses<ILabelClassNameContract>> = {
        hidden: void 0,
        managedClasses: void 0,
        tag: void 0
    };

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return isUndefined(LabelTag[this.props.tag]) ? LabelTag.label : LabelTag[this.props.tag];
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLabelElement | HTMLFieldSetElement> {
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
        let className: string = get(this.props, "managedClasses.label");

        if (this.props.hidden) {
            className = `${className} ${get(this.props, "managedClasses.label__hidden")}`;
        }

        return super.generateClassNames(className);
    }
}

export default Label;
export * from "./label.props";
export {ILabelClassNameContract};
