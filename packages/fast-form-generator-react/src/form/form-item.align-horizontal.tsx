import * as React from "react";
import { FormItemComponentMappingToProperyNamesProps } from "./form-item";
import styles from "./form-item.align-horizontal.style";
import { FormItemAlignHorizontalClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Direction } from "@microsoft/fast-jss-utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemAlignHorizontal extends React.Component<
    FormItemComponentMappingToProperyNamesProps &
        ManagedClasses<FormItemAlignHorizontalClassNameContract>,
    {}
> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemAlignHorizontal}>
                <label
                    className={this.props.managedClasses.formItemAlignHorizontal_label}
                    htmlFor={this.props.dataLocation}
                >
                    {this.props.label}
                </label>
                <div
                    className={
                        this.props.managedClasses.formItemAlignHorizontal_inputContainer
                    }
                >
                    {this.renderInput("left", 1)}
                    {this.renderInput("center", 2)}
                    {this.renderInput("right", 3)}
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
                return this.props.managedClasses.formItemAlignHorizontal_input__left;
            case "center":
                return this.props.managedClasses.formItemAlignHorizontal_input__center;
            case "right":
                return this.props.managedClasses.formItemAlignHorizontal_input__right;
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
                        />
                    </span>
                );
            }
        }
    }
}

export default manageJss(styles)(FormItemAlignHorizontal);
