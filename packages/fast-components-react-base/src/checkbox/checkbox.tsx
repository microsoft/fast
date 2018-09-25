import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { CheckboxHTMLTags, CheckboxProps, ICheckboxHandledProps, ICheckboxManagedClasses, ICheckboxUnhandledProps } from "./checkbox.props";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/**
 * Checkbox state interface
 */
export interface ICheckboxState {
    checked: boolean;
}

class Checkbox extends Foundation<
    ICheckboxHandledProps & ICheckboxManagedClasses,
    ICheckboxUnhandledProps,
    ICheckboxState
> {
    public static displayName: string = "Checkbox";

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(nextProps: ICheckboxHandledProps, prevState: ICheckboxState): null | Partial<ICheckboxState> {
        if (typeof nextProps.checked === "boolean" && nextProps.checked !== prevState.checked) {
            return {
                checked: nextProps.checked
            };
        }

        return null;
    }

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<ICheckboxHandledProps & IManagedClasses<ICheckboxClassNameContract>> = {
        checked: void 0,
        disabled: void 0,
        indeterminate: void 0,
        managedClasses: void 0,
        onChange: void 0,
        tag: void 0,
        text: void 0
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
            checked: this.props.checked || false
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
            <this.tag
                {...this.unhandledProps()}
                className={this.generateClassNames()}
            >
                <input
                    className={get(this.props, "managedClasses.checkbox_input")}
                    type="checkbox"
                    ref={this.inputRef}
                    onChange={this.handleCheckboxChange}
                    disabled={this.props.disabled || null}
                    checked={this.state.checked}
                />
                <span className={get(this.props, "managedClasses.checkbox_span")} />
                {this.renderLabel()}
            </this.tag>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classes: string = get(this.props, "managedClasses.checkbox");

        classes = this.props.disabled ? `${classes} ${get(this.props, "managedClasses.checkbox_disabled")}` : classes;

        return super.generateClassNames(classes);
    }

    /**
     * Stores HTML tag for use in render
     */
    private get tag(): string {
        return CheckboxHTMLTags[this.props.tag] || CheckboxHTMLTags.label;
    }

    /**
     * Render label if it exists
     */
    private renderLabel(): JSX.Element {
        if (this.props.text) {
            return (
                <span className={get(this.props, "managedClasses.checkbox_label")}>
                    {this.props.text}
                </span>
            );
        }
    }

    /**
     * Apply indeterminate state to items that are indeterminate.
     * This method should be called after render because it relies on element references.
     */
    private applyIndeterminateState(): void {
         if (this.props.indeterminate && this.inputRef.current && this.state.checked) {
            this.inputRef.current.indeterminate = this.props.indeterminate;
        }
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (typeof this.props.checked !== "boolean") {
            this.setState({checked: !this.state.checked});
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }
}

export default Checkbox;
export * from "./checkbox.props";
export {ICheckboxClassNameContract};
