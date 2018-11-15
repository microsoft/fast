import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TextActionHandledProps, TextActionUnhandledProps } from "./text-action.props";
import { TextField } from "../text-field/index";
import { get } from "lodash-es";
import { callToActionButtonOverrides } from "@microsoft/fast-components-styles-msft";

class TextAction extends Foundation<
    TextActionHandledProps,
    TextActionUnhandledProps,
    {}
> {
    public static displayName: string = "TextAction";

    protected handledProps: HandledProps<TextActionHandledProps> = {
        button: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <TextField
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                jssStyleSheet={callToActionButtonOverrides}
            >
                {this.props.children}
                {/* {this.props.button(this.props.managedClasses.textAction_button)} */}
            </TextField>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const classNames: string = get(this.props, "managedClasses.textAction");

        return super.generateClassNames(classNames);
    }
}

export default TextAction;
export * from "./text-action.props";
