import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import {
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextFieldType
} from "./text-field.props";
import { IManagedClasses, ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/* tslint:disable-next-line */
class TextField extends Foundation<ITextFieldHandledProps & IManagedClasses<ITextFieldClassNameContract>, React.HTMLAttributes<HTMLInputElement>, {}> {
    protected handledProps: HandledProps<ITextFieldHandledProps & IManagedClasses<ITextFieldClassNameContract>> = {
        disabled: void 0,
        placeholder: void 0,
        managedClasses: void 0,
        type: void 0
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
export { ITextFieldClassNameContract };
