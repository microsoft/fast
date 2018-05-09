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
        type: void 0,
        value: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            <input
                {...this.unhandledProps()}
                {...this.generateHandledAttributes()}
                className={this.generateClassNames()}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.textField"));
    }

    /**
     * Generates handled attributes based on props
     */
    private generateHandledAttributes(): Partial<ITextFieldHandledProps> {
        const attributes: Partial<ITextFieldHandledProps> = {};

        attributes.type = this.props.type ? this.props.type : TextFieldType.text;

        if (this.props.disabled) {
            attributes.disabled = this.props.disabled;
        }
        if (this.props.placeholder) {
            attributes.placeholder = this.props.placeholder;
        }

        if (this.props.value) {
            attributes.value = this.props.value;
        }

        return attributes;
    }

}

export default TextField;
export * from "./text-field.props";
export { ITextFieldClassNameContract };
