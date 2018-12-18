import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldType,
    TextFieldUnhandledProps,
} from "./text-field.props";
import {
    ManagedClasses,
    TextFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

class TextField extends Foundation<TextFieldHandledProps, TextFieldUnhandledProps, {}> {
    public static displayName: string = "TextField";

    protected handledProps: HandledProps<TextFieldHandledProps> = {
        disabled: void 0,
        placeholder: void 0,
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
                disabled={this.props.disabled || null}
                placeholder={this.props.placeholder || null}
                type={this.props.type || TextFieldType.text}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.textField"));
    }
}

export default TextField;
export * from "./text-field.props";
export { TextFieldClassNameContract };
