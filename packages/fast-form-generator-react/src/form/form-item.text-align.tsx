import React from "react";
import { FormItemComponentMappingToProperyNamesProps } from "./form-item";
import styles from "./form-item.text-align.style";
import { FormItemTextAlignClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";
import { Direction } from "@microsoft/fast-jss-utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemTextAlign extends FormItemBase<
    FormItemComponentMappingToProperyNamesProps &
        ManagedClasses<FormItemTextAlignClassNameContract>,
    {}
> {
    public static displayName: string = "formItemTextAlign";

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemTextAlign}>
                <div className={this.props.managedClasses.formItemTextAlign_control}>
                    <label
                        className={
                            this.props.managedClasses.formItemTextAlign_controlLabel
                        }
                        htmlFor={this.props.dataLocation}
                    >
                        {this.props.label}
                    </label>
                    <div
                        className={
                            this.props.managedClasses
                                .formItemTextAlign_controlInputContainer
                        }
                    >
                        {this.renderInput("left", 1)}
                        {this.renderInput("center", 2)}
                        {this.renderInput("right", 3)}
                    </div>
                </div>
                <div className={this.props.managedClasses.formItemTextAlign_softRemove}>
                    {this.renderSoftRemove(
                        this.props.managedClasses.formItemTextAlign_softRemoveInput
                    )}
                </div>
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange(this.props.dataLocation, value);
    };

    private isChecked(direction: string): boolean {
        return (
            this.props.data === direction ||
            (typeof this.props.data === "undefined" && this.props.default === direction)
        );
    }

    private getInputClassName(direction: string): string {
        switch (direction) {
            case "left":
                return this.props.managedClasses.formItemTextAlign_controlInput__left;
            case "center":
                return this.props.managedClasses.formItemTextAlign_controlInput__center;
            case "right":
                return this.props.managedClasses.formItemTextAlign_controlInput__right;
        }
    }

    private renderInput(direction: string, index: number): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                const className: string = this.getInputClassName(direction);

                return (
                    <span>
                        <input
                            className={className}
                            id={this.props.dataLocation}
                            type="radio"
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={`${direction} align`}
                            onChange={this.onChange.bind(this, direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}

export default manageJss(styles)(FormItemTextAlign);
