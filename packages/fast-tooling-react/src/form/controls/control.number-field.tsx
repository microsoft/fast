import React from "react";
import { get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { getStringValue } from "../utilities";
import styles from "./control.number-field.style";
import {
    NumberFieldClassNameContractFormControl,
    NumberFieldPropsFormControl,
} from "./control.number-field.props";
import BaseFormControl from "./template.control.abstract";

/**
 * Schema form component definition
 * @extends React.Component
 */
class NumberFieldFormControl extends BaseFormControl<
    NumberFieldPropsFormControl & ManagedClasses<NumberFieldClassNameContractFormControl>,
    {}
> {
    public static displayName: string = "NumberFieldFormControl";

    public render(): JSX.Element {
        return (
            <div className={this.generateClassNames()}>
                <div
                    className={
                        this.props.managedClasses.numberFieldFormControl_controlRegion
                    }
                >
                    <div
                        className={
                            this.props.managedClasses.numberFieldFormControl_control
                        }
                    >
                        <div
                            className={get(
                                this.props,
                                "managedClasses.numberFieldFormControl_controlLabelRegion"
                            )}
                        >
                            <label
                                className={
                                    this.props.managedClasses
                                        .numberFieldFormControl_controlLabel
                                }
                                htmlFor={this.props.dataLocation}
                            >
                                {this.props.label}
                            </label>
                            {this.renderDefaultValueIndicator(
                                get(
                                    this.props,
                                    "managedClasses.numberFieldFormControl_defaultValueIndicator"
                                )
                            )}
                            {this.renderBadge(
                                get(
                                    this.props,
                                    "managedClasses.numberFieldFormControl_badge"
                                )
                            )}
                        </div>
                        <input
                            className={
                                this.props.managedClasses
                                    .numberFieldFormControl_controlInput
                            }
                            id={this.props.dataLocation}
                            type="number"
                            value={this.getValue()}
                            name={this.props.dataLocation}
                            onChange={this.handleChange}
                            min={this.props.min}
                            max={this.props.max}
                            step={this.props.step}
                            disabled={this.props.disabled}
                            ref={this.inputRef}
                            onBlur={this.updateValidity}
                            onFocus={this.reportValidity}
                        />
                    </div>
                    <div
                        className={
                            this.props.managedClasses.numberFieldFormControl_softRemove
                        }
                    >
                        {this.renderSoftRemove(
                            this.props.managedClasses
                                .numberFieldFormControl_softRemoveInput
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(
                        this.props,
                        "managedClasses.numberFieldFormControl_invalidMessage"
                    )
                )}
            </div>
        );
    }

    /**
     * Make sure this is not NaN
     */
    private getNumberValue(value: string): number {
        const newValue: number = parseFloat(value);
        if (!isNaN(newValue)) {
            return newValue;
        }

        return this.props.data;
    }

    /**
     * Handles the onChange event for the input
     */
    private handleChange = ({ target: { value } }: any): void => {
        const normalizedValue: number = this.getNumberValue(value);
        return this.props.onChange(this.props.dataLocation, normalizedValue);
    };

    private generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.numberFieldFormControl");

        if (this.props.disabled) {
            classes += ` ${get(
                this.props,
                "managedClasses.numberFieldFormControl__disabled"
            )}`;
        }

        return classes;
    }

    private getValue(): string {
        return getStringValue(this.props.data, this.props.default);
    }
}

export { NumberFieldFormControl };
export default manageJss(styles)(NumberFieldFormControl);
