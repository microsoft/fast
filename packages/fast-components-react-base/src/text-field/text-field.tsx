import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldProps,
    TextFieldType,
    TextFieldUnhandledProps,
} from "./text-field.props";
import {
    ManagedClasses,
    TextFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";
import { classNames } from "@microsoft/fast-web-utilities";

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
