import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IRadioHandledProps, IRadioManagedClasses, IRadioUnhandledProps, RadioHTMLTags, RadioProps } from "./radio.props";
import { IManagedClasses, IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/**
 * Radio state interface
 */
export interface IRadioState {
    checked: boolean;
}

class Radio extends Foundation<IRadioHandledProps & IRadioManagedClasses, IRadioUnhandledProps, IRadioState> {

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<IRadioHandledProps & IManagedClasses<IRadioClassNameContract>> = {
        checked: void 0,
        disabled: void 0,
        managedClasses: void 0,
        onChange: void 0,
        tag: void 0,
        text: void 0
    };

    /**
     * Provides reference to input
     */
    private inputRef: React.RefObject<HTMLInputElement>;

    /**
     * Define constructor
     */
    constructor(props: RadioProps) {
        super(props);

        this.state = {
            checked: this.props.checked || false
        };

        this.inputRef = React.createRef();
    }

    public render(): React.ReactElement<HTMLElement> {
        return (
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                <input
                    className={get(this.props, "managedClasses.radio_input")}
                    type="radio"
                    ref={this.inputRef}
                    onChange={this.handleRadioChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                />
                <span className={get(this.props, "managedClasses.radio_span")} />
                <span className={get(this.props, "managedClasses.radio_label")}>
                    {this.props.text ? this.props.text : null}
                </span>
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.radio");

        classes = this.props.disabled ? `${classes} ${get(this.props, "managedClasses.radio_disabled")}` : classes;

        return super.generateClassNames(classes);
    }

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return RadioHTMLTags[this.props.tag] || RadioHTMLTags.label;
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.checked !== "boolean") {
            this.setState({checked: !this.state.checked});
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }
}

export default Radio;
export * from "./radio.props";
export {IRadioClassNameContract};
