import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { textFieldOverrides } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import { get } from "lodash-es";
import React from "react";
import { TextField } from "../text-field";
import { DisplayNamePrefix } from "../utilities";
import {
    TextActionAppearance,
    TextActionButtonPosition,
    TextActionHandledProps,
    TextActionProps,
    TextActionUnhandledProps,
} from "./text-action.props";

/**
 * Text action state interface
 */
export interface TextActionState {
    focused: boolean;
}
class TextAction extends Foundation<
    TextActionHandledProps,
    TextActionUnhandledProps,
    TextActionState
> {
    public static displayName: string = `${DisplayNamePrefix}TextAction`;

    public static defaultProps: Partial<TextActionProps> = {
        buttonPosition: TextActionButtonPosition.after,
        managedClasses: {},
    };

    protected handledProps: HandledProps<TextActionHandledProps> = {
        appearance: void 0,
        afterGlyph: void 0,
        beforeGlyph: void 0,
        button: void 0,
        buttonPosition: void 0,
        className: void 0,
        managedClasses: void 0,
    };

    constructor(props: TextActionProps) {
        super(props);

        this.state = {
            focused: false,
        };
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()}>
                {this.buttonExists() &&
                this.props.buttonPosition === TextActionButtonPosition.before
                    ? this.generateButton()
                    : null}
                {this.generateBeforeGlyph()}
                <TextField
                    {...this.unhandledProps()}
                    disabled={get(this.props, "disabled", null)}
                    placeholder={get(this.props, "placeholder", null)}
                    jssStyleSheet={textFieldOverrides}
                    onBlur={this.handleOnBlur}
                    onFocus={this.handleOnFocus}
                />
                {this.generateAfterGlyph()}
                {this.buttonExists() &&
                this.props.buttonPosition === TextActionButtonPosition.after
                    ? this.generateButton()
                    : null}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            textAction,
            textAction__disabled,
            textAction__focus,
        }: Partial<TextActionClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                textAction,
                [
                    this.props.managedClasses[
                        `textAction__${TextActionAppearance[this.props.appearance]}`
                    ],
                    !!this.props.appearance,
                ],
                [textAction__disabled, this.props.disabled],
                [textAction__focus, this.state.focused]
            )
        );
    }

    /**
     * Adds focus state to outer wrapper and fires callback if passed
     * In order to correctly focus the input and then the
     * possible button, a class must be added instead of using
     * focus-within via style
     */
    private handleOnFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.setState({ focused: true });

        if (typeof this.props.onFocus === "function") {
            this.props.onFocus(e);
        }
    };

    /**
     * Removes focus state and fires callback if passed
     */
    private handleOnBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.setState({ focused: false });

        if (typeof this.props.onBlur === "function") {
            this.props.onBlur(e);
        }
    };

    /**
     * Returns truthy if button exist
     */
    private buttonExists(): boolean {
        return typeof this.props.button === "function";
    }

    /**
     * Generate button
     */
    private generateButton(): React.ReactNode {
        return this.props.button(
            classNames(this.props.managedClasses.textAction_button),
            this.props.disabled
        );
    }

    /**
     * Generates after glyph based on props
     */
    private generateAfterGlyph(): React.ReactNode {
        if (typeof this.props.afterGlyph === "function") {
            return this.props.afterGlyph(
                classNames(this.props.managedClasses.textAction_afterGlyph)
            );
        }
    }

    /**
     * Generates before glyph based on props
     */
    private generateBeforeGlyph(): React.ReactNode {
        if (typeof this.props.beforeGlyph === "function") {
            return this.props.beforeGlyph(
                classNames(this.props.managedClasses.textAction_beforeGlyph)
            );
        }
    }
}

export default TextAction;
export * from "./text-action.props";
