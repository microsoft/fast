import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    TextAreaHandledProps,
    TextAreaManagedClasses,
    TextAreaUnhandledProps,
} from "./text-area.props";
import {
    ManagedClasses,
    TextAreaClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

class TextArea extends Foundation<TextAreaHandledProps, TextAreaUnhandledProps, {}> {
    public static displayName: string = "TextArea";

    protected handledProps: HandledProps<TextAreaHandledProps> = {
        disabled: void 0,
        placeholder: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLTextAreaElement> {
        return (
            <textarea
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled || null}
                placeholder={this.props.placeholder || null}
            />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.textArea", ""));
    }
}

export default TextArea;
export * from "./text-area.props";
export { TextAreaClassNameContract };
