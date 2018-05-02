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

/* tslint:disable-next-line */
class Checkbox extends Foundation<ICheckboxHandledProps & ICheckboxManagedClasses, ICheckboxUnhandledProps, ICheckboxState> {
    protected handledProps: HandledProps<ICheckboxHandledProps & IManagedClasses<ICheckboxClassNameContract>> = {
        managedClasses: void 0,
        text: void 0,
        checked: void 0,
        indeterminate: void 0,
        disabled: void 0,
        tag: void 0
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
            checked: this.props.checked
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
    public render(): React.ReactElement<HTMLInputElement> {
        return (
            <this.tag className={this.generateClassNames()}>
                <input
                    {...this.unhandledProps()}
                    className={get(this.props, "managedClasses.checkbox_input")}
                    type="checkbox"
                    ref={this.inputRef}
                    onChange={this.handleCheckboxChange}
                    defaultChecked={this.props.checked}
                    disabled={this.props.disabled}
                />
                <span className={get(this.props, "managedClasses.checkbox_label")}>
                    {this.props.text ? this.props.text : null}
                </span>
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
     * Apply indeterminate state to items that are indeterminate.
     * This method should be called after render because it relies on element references.
     */
    private applyIndeterminateState(): void {
         if (this.props.indeterminate !== undefined && this.inputRef.current) {
            this.inputRef.current.indeterminate = this.props.indeterminate;
        }
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleCheckboxChange = (): void => {
        this.setState({checked: !this.state.checked});
    }
}

export default Checkbox;
export * from "./checkbox.props";
export {ICheckboxClassNameContract};
