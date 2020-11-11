import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { TextAlignControlClassNameContract } from "./control.text-align.style";
import { TextAlignControlProps } from "./control.text-align.props";
import { classNames } from "@microsoft/fast-web-utilities";

enum Direction {
    Left = "left",
    Center = "center",
    Right = "right",
}

/**
 * Custom form control definition
 */
class TextAlignControl extends React.Component<
    TextAlignControlProps & ManagedClasses<TextAlignControlClassNameContract>,
    {}
> {
    public static displayName: string = "TextAlignControl";

    public static defaultProps: Partial<
        TextAlignControlProps & ManagedClasses<TextAlignControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        return (
            <div
                className={classNames(this.props.managedClasses.textAlignControl, [
                    this.props.managedClasses.textAlignControl__disabled,
                    this.props.disabled,
                ])}
            >
                {this.renderInput(Direction.Left)}
                {this.renderInput(Direction.Center)}
                {this.renderInput(Direction.Right)}
            </div>
        );
    }

    private onChange = (value: string): void => {
        this.props.onChange({ value });
    };

    private isChecked(direction: string): boolean {
        return (
            this.props.value === direction ||
            (typeof this.props.value === "undefined" && this.props.default === direction)
        );
    }

    private getInputClassName(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return this.props.managedClasses.textAlignControl_input__left;
            case Direction.Center:
                return this.props.managedClasses.textAlignControl_input__center;
            case Direction.Right:
                return this.props.managedClasses.textAlignControl_input__right;
        }
    }

    private getDirectionLabel(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return this.props.strings.textAlignLeftLabel;
            case Direction.Center:
                return this.props.strings.textAlignCenterLabel;
            case Direction.Right:
                return this.props.strings.textAlignRightLabel;
        }
    }

    private renderInput(direction: Direction): React.ReactNode {
        if (this.props.options && Array.isArray(this.props.options)) {
            const option: string = this.props.options.find((item: string) => {
                return item === direction;
            });

            if (typeof option !== "undefined") {
                return (
                    <span>
                        <input
                            className={classNames(
                                this.props.managedClasses.textAlignControl_input,
                                this.getInputClassName(direction)
                            )}
                            id={this.props.dataLocation}
                            type={"radio"}
                            value={direction}
                            name={this.props.dataLocation}
                            aria-label={this.getDirectionLabel(direction)}
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

export { TextAlignControl };
export default manageJss(styles)(TextAlignControl);
