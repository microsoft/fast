import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.select.style";
import { SelectControlProps } from "./control.select.props";
import { SelectControlClassNameContract } from "./control.select.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 */
/* tslint:disable-next-line */
class SelectControl extends React.Component<
    SelectControlProps & ManagedClasses<SelectControlClassNameContract>,
    {}
> {
    public static displayName: string = "SelectControl";

    public static defaultProps: Partial<
        SelectControlProps & ManagedClasses<SelectControlClassNameContract>
    > = {
        managedClasses: {},
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        const {
            selectControl,
            selectControl__disabled,
            selectControl__default,
            selectControl_input,
        }: SelectControlClassNameContract = this.props.managedClasses;

        return (
            <span
                className={classNames(
                    selectControl,
                    [selectControl__disabled, this.props.disabled],
                    [
                        selectControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
            >
                <select
                    className={selectControl_input}
                    onChange={this.handleChange()}
                    value={this.getValue()}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef as React.Ref<HTMLSelectElement>}
                    onBlur={this.props.updateValidity}
                    onFocus={this.props.reportValidity}
                    required={this.props.required}
                >
                    {this.renderOptions()}
                </select>
            </span>
        );
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLSelectElement>) => void) => {
        return (e: React.ChangeEvent<HTMLSelectElement>): void => {
            const value: any = this.props.options.find(
                (option: any): any => {
                    return typeof option === "string"
                        ? option === e.target.value
                        : JSON.stringify(option) === e.target.value;
                }
            );
            this.props.onChange({ value });
        };
    };

    /**
     * Stringify the select value
     */
    private stringify(value: any): string | any {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return value;
        }
    }

    private getValue(): any {
        return typeof this.props.value !== "undefined"
            ? this.props.value
            : typeof this.props.default !== "undefined"
                ? this.props.default
                : "";
    }

    /**
     * Renders the selects option elements
     */
    private renderOptions(): React.ReactNode {
        return (this.props.options || []).map((item: any, index: number) => {
            return (
                <option key={index} value={item}>
                    {typeof item === "string" || typeof item === "number"
                        ? item
                        : this.stringify(item)}
                </option>
            );
        });
    }
}

export { SelectControl };
export default manageJss(styles)(SelectControl);
