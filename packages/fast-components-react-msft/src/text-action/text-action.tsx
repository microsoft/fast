import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TextActionHandledProps, TextActionUnhandledProps } from "./text-action.props";
import { TextField } from "../text-field/index";
import { get } from "lodash-es";
import { textFieldOverrides } from "@microsoft/fast-components-styles-msft";

class TextAction extends Foundation<
    TextActionHandledProps,
    TextActionUnhandledProps,
    {}
> {
    public static displayName: string = "TextAction";

    protected handledProps: HandledProps<TextActionHandledProps> = {
        afterGlyph: void 0,
        beforeGlyph: void 0,
        button: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()} {...this.unhandledProps()}>
                {typeof this.props.beforeGlyph === "function"
                    ? this.props.beforeGlyph(
                          get(this.props, "managedClasses.textAction_beforeGlyph")
                      )
                    : null}
                <TextField
                    disabled={this.props.disabled}
                    jssStyleSheet={textFieldOverrides}
                >
                    {this.props.children}
                </TextField>
                {typeof this.props.afterGlyph === "function" && !this.props.button
                    ? this.props.afterGlyph(
                          get(this.props, "managedClasses.textAction_afterGlyph")
                      )
                    : null}
                {typeof this.props.button === "function"
                    ? this.props.button(
                          get(this.props, "managedClasses.textAction_button")
                      )
                    : null}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.textAction"));
    }
}

export default TextAction;
export * from "./text-action.props";
