import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    RadioHandledProps,
    RadioManagedClasses,
    RadioProps,
    RadioUnhandledProps,
} from "./radio.props";
import {
    ManagedClasses,
    RadioClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/**
 * Radio slot options
 */
export enum RadioSlot {
    label = "label",
}

interface RadioState {
    checked: boolean;
}

class Radio extends Foundation<RadioHandledProps, RadioUnhandledProps, RadioState> {
    public static displayName: string = "Radio";

    public static getDerivedStateFromProps(
        nextProps: RadioProps,
        prevState: RadioState
    ): null | Partial<RadioState> {
        if (
            typeof nextProps.checked === "boolean" &&
            nextProps.checked !== prevState.checked
        ) {
            return {
                checked: nextProps.checked,
            };
        }

        return null;
    }

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<RadioHandledProps> = {
        inputId: void 0,
        checked: void 0,
        disabled: void 0,
        managedClasses: void 0,
        onChange: void 0,
        children: void 0,
    };

    constructor(props: RadioProps) {
        super(props);

        this.state = {
            checked: this.props.checked || false,
        };
    }

    public render(): React.ReactElement<HTMLElement> {
        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <input
                    className={get(this.props, "managedClasses.radio_input")}
                    type="radio"
                    id={this.props.inputId}
                    onChange={this.handleRadioChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                />
                <span
                    className={get(this.props, "managedClasses.radio_stateIndicator")}
                />
                {this.renderChildrenWithSlot(RadioSlot.label)}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.radio", "");

        if (this.props.disabled) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.radio__disabled",
                ""
            )}`;
        }

        if (this.state.checked) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.radio__checked",
                ""
            )}`;
        }

        return super.generateClassNames(classes);
    }

    private renderChildrenWithSlot(slot: RadioSlot): React.ReactChild[] {
        const node: React.ReactNode = this.withSlot(RadioSlot.label);

        return React.Children.map(node, (child: JSX.Element, index: number) => {
            let labelSlotClassName: string = get(
                this.props,
                "managedClasses.radio_label"
            );
            const classNameKey: string = "className";

            if (child.props[classNameKey] !== undefined) {
                labelSlotClassName = `${child.props[classNameKey]} ${labelSlotClassName}`;
            }

            return React.cloneElement(child, { className: labelSlotClassName });
        });
    }

    private handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.checked !== "boolean") {
            this.setState({ checked: !this.state.checked });
        }

        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    };
}

export default Radio;
export * from "./radio.props";
export { RadioClassNameContract };
