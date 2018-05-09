import * as React from "react";
import { IFormItemComponentMappingToProperyNamesProps } from "./form-item";
import styles from "./form-item.align-vertical.style";
import { IFormItemAlignVerticalClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemAlignVertical extends React.Component<IFormItemComponentMappingToProperyNamesProps & IManagedClasses<IFormItemAlignVerticalClassNameContract>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemAlignVertical}>
                <label
                    className={this.props.managedClasses.formItemAlignVertical_label}
                    htmlFor={this.props.dataLocation}
                >
                    {this.props.label}
                </label>
                <div>
                    {this.renderInput("top", 1)}
                    {this.renderInput("center", 2)}
                    {this.renderInput("bottom", 3)}
                </div>
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange(this.props.dataLocation, value);
    }

    private isChecked(direction: string): boolean {
        return this.props.data === direction || (typeof this.props.data === "undefined" && this.props.default === direction);
    }

    private renderInput(direction: string, index: number): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                let className: string = "";

                switch (direction) {
                    case "top":
                        className = this.props.managedClasses.formItemAlignVertical_input__top;
                        break;
                    case "center":
                        className = this.props.managedClasses.formItemAlignVertical_input__center;
                        break;
                    case "bottom":
                        className = this.props.managedClasses.formItemAlignVertical_input__bottom;
                }

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

export default manageJss(styles)(FormItemAlignVertical);
