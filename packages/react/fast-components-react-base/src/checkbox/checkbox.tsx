import { CheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { get } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    CheckboxHandledProps,
    CheckboxProps,
    CheckboxSlot,
    CheckboxUnhandledProps,
} from "./checkbox.props";

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

    public static defaultProps: Partial<CheckboxProps> = {
        managedClasses: {},
    };

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
        ariaLabel: void 0,
        checked: void 0,
        disabled: void 0,
        inputId: void 0,
        indeterminate: void 0,
        label: void 0,
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
        const {
            checkbox_input,
            checkbox_stateIndicator,
        }: CheckboxClassNameContract = this.props.managedClasses;

        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <input
                    className={classNames(checkbox_input)}
                    id={this.props.inputId}
                    name={this.props.name}
                    type="checkbox"
                    ref={this.inputRef}
                    onChange={this.handleCheckboxChange}
                    disabled={this.props.disabled || null}
                    aria-label={this.props.ariaLabel || null}
                    checked={this.state.checked}
                    value={this.props.value}
                />
                <span className={classNames(checkbox_stateIndicator)} />
                {this.renderLabelBySlot()}
                {this.renderLabel()}
            </div>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        const {
            checkbox,
            checkbox__disabled,
            checkbox__checked,
            checkbox__indeterminate,
        }: CheckboxClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                checkbox,
                [checkbox__disabled, this.props.disabled],
                [checkbox__checked, this.state.checked],
                [checkbox__indeterminate, this.props.indeterminate]
            )
        );
    }

    /**
     * @deprecated - remove this method in next major version
     * Render label if it exists
     */
    private renderLabelBySlot(): Array<React.ReactElement<any>> {
        return React.Children.map(
            this.withSlot(CheckboxSlot.label),
            (label: React.ReactElement<any>): React.ReactElement<any> => {
                let className: string | void = this.props.managedClasses.checkbox_label;

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

    private renderLabel(): React.ReactNode {
        const { checkbox_label }: CheckboxClassNameContract = this.props.managedClasses;

        if (typeof this.props.label === "function") {
            return this.props.label(classNames(checkbox_label));
        }
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
