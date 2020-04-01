import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.textarea.style";
import { TextareaControlProps } from "./control.textarea.props";
import { TextareaControlClassNameContract } from "./control.textarea.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { isDefault } from "./utilities/form";

/**
 * Form control definition
 */
class TextareaControl extends React.Component<
    TextareaControlProps & ManagedClasses<TextareaControlClassNameContract>,
    {}
> {
    public static displayName: string = "TextareaControl";

    public static defaultProps: Partial<
        TextareaControlProps & ManagedClasses<TextareaControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public render(): React.ReactNode {
        return (
            <textarea
                className={classNames(
                    this.props.managedClasses.textareaControl,
                    [
                        this.props.managedClasses.textareaControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.textareaControl__default,
                        isDefault(this.props.value, this.props.default),
                    ]
                )}
                id={this.props.dataLocation}
                name={this.props.dataLocation}
                rows={this.getRows()}
                value={this.getValue()}
                onChange={this.handleChange()}
                disabled={this.props.disabled}
                ref={this.props.elementRef as React.Ref<HTMLTextAreaElement>}
                onFocus={this.props.reportValidity}
                onBlur={this.props.updateValidity}
                required={this.props.required}
            />
        );
    }

    private getRows(): number {
        return typeof this.props.rows === "number" ? this.props.rows : 3;
    }

    private getValue(): string {
        return typeof this.props.value === "string"
            ? this.props.value
            : typeof this.props.default === "string"
                ? this.props.default
                : "";
    }

    private handleChange = (): ((e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
        return (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            this.props.onChange({ value: e.target.value });
        };
    };
}

export { TextareaControl };
export default manageJss(styles)(TextareaControl);
