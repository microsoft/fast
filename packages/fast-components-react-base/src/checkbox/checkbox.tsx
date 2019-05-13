import React from "react";
import ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CheckboxHandledProps,
    CheckboxManagedClasses,
    CheckboxProps,
    CheckboxSlot,
    CheckboxUnhandledProps,
} from "./checkbox.props";
import {
    CheckboxClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

/**
 * Checkbox state interface
 */
export interface CheckboxState {
    checked: boolean;
}

class Checkbox extends Foundation<
    CheckboxHandledProps,
    CheckboxUnhandledProps,
    CheckboxState
> {
    public static displayName: string = `${DisplayNamePrefix}Checkbox`;

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: CheckboxProps,
        prevState: CheckboxState
    ): null | Partial<CheckboxState> {
        if (
            typeof nextProps.checked === "boolean" &&
            nextProps.checked !== prevState.checked
        ) {
            return {
                checked: nextProps.checked,
            };
        }

        return null;
    }

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<CheckboxHandledProps> = {
        checked: void 0,
        disabled: void 0,
        inputId: void 0,
        indeterminate: void 0,
        managedClasses: void 0,
        name: void 0,
        onChange: void 0,
        value: void 0,
    };

    /**
     * Provides reference to input
     */
    private inputRef: React.RefObject<HTMLInputElement>;

    /**
     * Define constructor
     */
    constructor(props: CheckboxProps) {
        super(props);

        this.state = {
            checked: this.props.checked || false,
        };

        this.inputRef = React.createRef();
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        this.applyIndeterminateState();
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(): void {
        this.applyIndeterminateState();
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLElement> {
        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <input
                    className={get(this.props, "managedClasses.checkbox_input")}
                    id={this.props.inputId}
                    name={this.props.name}
                    type="checkbox"
                    ref={this.inputRef}
                    onChange={this.handleCheckboxChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                    value={this.props.value}
                />
                <span
                    className={get(this.props, "managedClasses.checkbox_stateIndicator")}
                />
                {this.renderLabel()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.checkbox", "");

        if (this.props.disabled) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.checkbox__disabled",
                ""
            )}`;
        }

        if (this.state.checked) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.checkbox__checked",
                ""
            )}`;
        }

        if (this.props.indeterminate) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.checkbox__indeterminate",
                ""
            )}`;
        }

        return super.generateClassNames(classes);
    }

    /**
     * Render label if it exists
     */
    private renderLabel(): Array<React.ReactElement<any>> {
        return React.Children.map(
            this.withSlot(CheckboxSlot.label),
            (label: React.ReactElement<any>): React.ReactElement<any> => {
                let className: string | undefined = get(
                    this.props,
                    "managedClasses.checkbox_label"
                );

                if (typeof className !== "string") {
                    return label;
                }

                const labelClassName: string | undefined = get(label, "props.className");

                if (typeof labelClassName === "string") {
                    className = `${labelClassName} ${className}`;
                }

                return React.cloneElement(label, { className });
            }
        );
    }

    /**
     * Apply indeterminate state to items that are indeterminate.
     * This method should be called after render because it relies on element references.
     */
    private applyIndeterminateState(): void {
        if (this.props.indeterminate && this.inputRef.current) {
            this.inputRef.current.indeterminate = this.props.indeterminate;
        }
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.checked !== "boolean") {
            this.setState({ checked: !this.state.checked });
        }

        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    };
}

export default Checkbox;
export * from "./checkbox.props";
export { CheckboxClassNameContract };
