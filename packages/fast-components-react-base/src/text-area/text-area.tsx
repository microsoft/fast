import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    TextAreaHandledProps,
    TextAreaProps,
    TextAreaUnhandledProps,
} from "./text-area.props";

class TextArea extends Foundation<TextAreaHandledProps, TextAreaUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}TextArea`;

    public static defaultProps: Partial<TextAreaProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<TextAreaHandledProps> = {
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLTextAreaElement> {
        return (
            <textarea {...this.unhandledProps()} className={this.generateClassNames()} />
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.textArea));
    }
}

export default TextArea;
export * from "./text-area.props";
export { TextAreaClassNameContract };
