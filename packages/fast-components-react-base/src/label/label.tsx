import * as React from "react";
import * as ReactDOM from "react-dom";
import { get, isUndefined } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    LabelHandledProps,
    LabelManagedClasses,
    LabelProps,
    LabelTag,
    LabelUnhandledProps
} from "./label.props";
import { LabelClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

class Label extends Foundation<
    LabelHandledProps,
    LabelUnhandledProps,
    {}
> {
    public static displayName: string = "Label";

    public static defaultProps: Partial<LabelProps> = {
        tag: LabelTag.label
    };

    protected handledProps: HandledProps<LabelHandledProps & ManagedClasses<LabelClassNameContract>> = {
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
export { LabelClassNameContract };
