import * as React from "react";
import { IFormItemComponentMappingToProperyNamesProps } from "./form-item";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemTheme extends React.Component<IFormItemComponentMappingToProperyNamesProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <label htmlFor={this.props.dataLocation}>{this.props.label}</label>
                <div>
                    {this.renderInput("light", 1)}
                    {this.renderInput("dark", 2)}
                </div>
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange(this.props.dataLocation, value);
    }

    private isChecked(theme: string): boolean {
        return this.props.data === theme || (typeof this.props.data === "undefined" && this.props.default === theme);
    }

    private renderInput(theme: string, index: number): JSX.Element {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: any = this.props.options.find((item: string): any => {
                return item === theme;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            id={this.props.dataLocation}
                            type="radio"
                            value={theme}
                            name="theme"
                            aria-label={`theme ${theme}`}
                            onChange={this.onChange.bind(this, theme)}
                            checked={this.isChecked(theme)}
                        />
                        <span />
                    </span>
                );
            }
        }
    }
}

export default FormItemTheme;
