import * as React from "react";
import { IFormItemComponentMappingToProperyNamesProps } from "./form-item";
import styles from "./form-item.align-horizontal.style";
import { IFormItemAlignHorizontalClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemAlignHorizontal extends React.Component<IFormItemComponentMappingToProperyNamesProps & IManagedClasses<IFormItemAlignHorizontalClassNameContract>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemAlignHorizontal}>
                <label
                    className={this.props.managedClasses.formItemAlignHorizontal_label}
                    htmlFor="alignHorizontal"
                >
                    {this.props.label}
                </label>
                <div>
                    {this.renderInput("left", 1)}
                    {this.renderInput("center", 2)}
                    {this.renderInput("right", 3)}
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
                    case "left":
                        className = this.props.managedClasses.formItemAlignHorizontal_input__left;
                        break;
                    case "center":
                        className = this.props.managedClasses.formItemAlignHorizontal_input__center;
                        break;
                    case "right":
                        className = this.props.managedClasses.formItemAlignHorizontal_input__right;
                }

                return (
                    <span>
                        <input
                            className={className}
                            id={`alignHorizontal${index}`}
                            type="radio"
                            value={direction}
                            name="alignHorizontal"
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
