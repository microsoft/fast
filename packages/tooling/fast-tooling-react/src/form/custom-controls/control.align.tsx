import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { AlignControlClassNameContract } from "./control.align.style";
import { AlignControlProps, Alignment } from "./control.align.props";
import { classNames } from "@microsoft/fast-web-utilities";

/**
 * Custom form control definition
 */
class AlignControl extends React.Component<
    AlignControlProps & ManagedClasses<AlignControlClassNameContract>,
    {}
> {
    public static displayName: string = "AlignControl";

    public static defaultProps: Partial<
        AlignControlProps & ManagedClasses<AlignControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        return (
            <div
                className={classNames(this.props.managedClasses.alignControl, [
                    this.props.managedClasses.alignControl__disabled,
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Alignment.top)}
                {this.renderInput(Alignment.center)}
                {this.renderInput(Alignment.bottom)}
            </div>
        );
    }

    private isChecked(direction: string): boolean {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }

    private handleChange(value: string): () => void {
        return (): void => {
            this.props.onChange({ value });
        };
    }

    private renderInput(direction: Alignment): React.ReactNode {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                this.props.managedClasses.alignControl_input,
                                [
                                    this.props.managedClasses.alignControl_input__bottom,
                                    direction === Alignment.bottom,
                                ],
                                [
                                    this.props.managedClasses.alignControl_input__center,
                                    direction === Alignment.center,
                                ],
                                [
                                    this.props.managedClasses.alignControl_input__top,
                                    direction === Alignment.top,
                                ]
                            )}
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={`${direction} align`}
                            onChange={this.handleChange(direction)}
                            checked={this.isChecked(direction)}
                            disabled={this.props.disabled}
                        />
                    </span>
                );
            }
        }
    }
}

export { AlignControl };
export default manageJss(styles)(AlignControl);
