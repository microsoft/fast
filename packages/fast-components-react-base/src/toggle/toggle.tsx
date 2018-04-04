import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";

import {IToggleProps} from "./toggle.props";
import {IToggleClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/**
 * Toggle state interface
 */
export interface IToggleState {
    checked: boolean;
}
/**
 * Toggle base component
 */
/* tslint:disable-next-line */
class Toggle extends Foundation<IToggleProps & IManagedClasses<IToggleClassNameContract>,  React.AllHTMLAttributes<HTMLElement>, IToggleState> {
    protected handledProps: HandledProps<IToggleProps & IManagedClasses<IToggleClassNameContract>> = {
        managedClasses: void 0,
        disabled: void 0,
        id: void 0,
        labelId: void 0,
        selected: void 0,
        selectedString: void 0,
        spanId: void 0,
        unselectedString: void 0
    };

    /**
     * Define constructor
     */
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.selected
        };
    }

    /**
     * Generates global aria-disabled
     */
    private generateAttributes() {
        return this.props.disabled ?  {'aria-disabled': true} : null;
    }

    /**
     * Generates toggle attributes
     */
    private generateToggleAttributes() {
        let toggleAttributes = {};

        if (this.props.disabled) {
            toggleAttributes['disabled'] = 'disabled';
        }

        toggleAttributes['id'] = this.props.id;
        toggleAttributes['defaultChecked'] = this.state.checked;
        toggleAttributes['aria-describedby'] = this.props.spanId;

        return toggleAttributes;
    }

    /**
     * Creates proper string based on state
     */
    private generateChildren() {
        return this.state.checked ? this.props.selectedString : this.props.unselectedString;
    }

    /**
     * Passes toggle onClick to consumer
     */
    private handleClickEvent = (e) => {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    /**
     * Handles onChange as a controlled component
     */
    private handleToggleChange = (e) => {
        this.setState({checked: !this.state.checked})
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.toggle);
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                {...this.generateAttributes()}
            >
                <label
                    id={this.props.labelId}
                    htmlFor={this.props.id}
                >
                    {this.props.children}
                </label>
                <div>
                    <input
                        type='checkbox'
                        {...this.generateToggleAttributes()}
                        onClick={this.handleClickEvent}
                        value={this.generateChildren()}
                        onChange={this.handleToggleChange}
                    />
                    <span />
                </div>
                <span id={this.props.spanId}>
                    {this.generateChildren()}
                </span>
            </div>
        );
    }
}

export default Toggle;
export {IToggleProps, IToggleClassNameContract};