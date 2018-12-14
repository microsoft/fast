import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ButtonPosition,
    TextActionHandledProps,
    TextActionProps,
    TextActionUnhandledProps,
} from "./text-action.props";
import { textFieldOverrides } from "@microsoft/fast-components-styles-msft";
import { TextField } from "../text-field";
import { get } from "lodash-es";

class TextAction extends Foundation<
    TextActionHandledProps,
    TextActionUnhandledProps,
    {}
> {
    public static displayName: string = "TextAction";

    public static defaultProps: Partial<TextActionProps> = {
        buttonPosition: ButtonPosition.after,
    };

    protected handledProps: HandledProps<TextActionHandledProps> = {
        afterGlyph: void 0,
        beforeGlyph: void 0,
        button: void 0,
        buttonPosition: void 0,
        managedClasses: void 0,
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()}>
                {this.getButton() && this.props.buttonPosition === ButtonPosition.before
                    ? this.props.button(
                          get(this.props, "managedClasses.textAction_button"),
                          this.props.disabled
                      )
                    : null}
                {this.generateBeforeGlyph()}
                <TextField
                    {...this.unhandledProps()}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    jssStyleSheet={textFieldOverrides}
                />
                {this.generateAfterGlyph()}
                {this.getButton() && this.props.buttonPosition === ButtonPosition.after
                    ? this.props.button(
                          get(this.props, "managedClasses.textAction_button"),
                          this.props.disabled
                      )
                    : null}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.textAction");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.textAction__disabled"
            )}`;
        }

        return super.generateClassNames(classNames);
    }

    /**
     * Returns truthy if button exist
     */
    private getButton(): boolean {
        return typeof this.props.button === "function";
    }

    /**
     * Generates after glyph based on props
     */
    private generateAfterGlyph(): React.ReactNode {
        if (typeof this.props.afterGlyph === "function") {
            if (
                (this.getButton() &&
                    this.props.buttonPosition !== ButtonPosition.after) ||
                !this.getButton()
            ) {
                return this.props.afterGlyph(
                    get(this.props, "managedClasses.textAction_afterGlyph")
                );
            }
        }
    }

    /**
     * Generates before glyph based on props
     */
    private generateBeforeGlyph(): React.ReactNode {
        if (typeof this.props.beforeGlyph === "function") {
            if (
                (this.getButton() &&
                    this.props.buttonPosition !== ButtonPosition.before) ||
                !this.getButton()
            ) {
                return this.props.beforeGlyph(
                    get(this.props, "managedClasses.textAction_beforeGlyph")
                );
            }
        }
    }
}

export default TextAction;
export * from "./text-action.props";
