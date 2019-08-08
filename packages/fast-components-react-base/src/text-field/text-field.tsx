import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    TextFieldHandledProps,
    TextFieldProps,
    TextFieldType,
    TextFieldUnhandledProps,
} from "./text-field.props";

class TextField extends Foundation<TextFieldHandledProps, TextFieldUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TextField`;
    public static defaultProps: Partial<TextFieldProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<TextFieldHandledProps> = {
        managedClasses: void 0,
        type: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            <input
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                type={this.props.type || TextFieldType.text}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.textField));
    }
}

export default TextField;
export * from "./text-field.props";
export { TextFieldClassNameContract };
