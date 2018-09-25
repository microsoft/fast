import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IRadioHandledProps, IRadioManagedClasses, IRadioUnhandledProps, RadioProps } from "./radio.props";
import { IManagedClasses, IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/**
 * Radio slot options
 */
export enum RadioSlot {
    label = "label"
}

/**
 * Radio state interface
 */
export interface IRadioState {
    checked: boolean;
}

class Radio extends Foundation<IRadioHandledProps & IRadioManagedClasses, IRadioUnhandledProps, IRadioState> {

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(nextProps: IRadioHandledProps, prevState: IRadioState): null | Partial<IRadioState> {
        if (typeof nextProps.checked === "boolean" && nextProps.checked !== prevState.checked) {
            return {
                checked: nextProps.checked
            };
        }

        return null;
    }

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<IRadioHandledProps & IManagedClasses<IRadioClassNameContract>> = {
        id: void 0,
        checked: void 0,
        disabled: void 0,
        managedClasses: void 0,
        onChange: void 0,
        children: void 0
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
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                <input
                    className={get(this.props, "managedClasses.radio_input")}
                    type="radio"
                    ref={this.inputRef}
                    id={this.props.id}
                    onChange={this.handleRadioChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                />
                <span className={get(this.props, "managedClasses.radio_stateIndicator")} />
                {this.renderChildrenBySlot(RadioSlot.label)}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.radio");

        classes = this.props.disabled ? `${classes} ${get(this.props, "managedClasses.radio__disabled")}` : classes;

        return super.generateClassNames(classes);
    }

    /**
     * Renders slotted children in the appropriate slot
     */
    private renderChildrenBySlot(slot: RadioSlot): React.ReactChild[] {
        return React.Children.map(this.props.children, (child: JSX.Element, index: number) => {
            if (child.props && child.props.slot === slot) {
                return (
                    <React.Fragment key={index}>
                        {child}
                    </React.Fragment>
                );
            }
        });
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
