import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";
import {isUndefined} from 'lodash';
import {IToggleProps} from "./toggle.props";
import {IToggleClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

export interface IToggleState {
    selected: boolean;
}

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

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.selected
        };
    }

    private generateAttributes() {
        return this.props.disabled ?  {'aria-disabled': true} : null;
    }

    private generateToggleAttributes() {
        let toggleAttributes = {};

        if (this.props.disabled) {
            toggleAttributes['disabled'] = 'disabled';
        }

        toggleAttributes['id'] = this.props.id;
        toggleAttributes['name'] = this.props.name;
        toggleAttributes['defaultChecked'] = this.state.selected;
        toggleAttributes['aria-describedby'] = this.props.spanId;

        return toggleAttributes;
    }

    /**
     * Generate HTML attributes for span element based on props
     */
    private generateStateDescriptorAttributes() {
        return {id: this.props.spanId};
    }

    /**
     * Creates span element child nodes based on props
     */
    private generateChildren() {
        return this.state.selected ? this.props.selectedString : this.props.unselectedString;
    }

    /**
     * Handles toggle click
     */
    private handleClickEvent = (e) => {
        console.log('click');
    }

    private handleToggleChange = (e) => {
        this.setState({selected: !this.state.selected})
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
                <span {...this.generateStateDescriptorAttributes()}>
                    {this.generateChildren()}
                </span>
            </div>
        );
    }
}

export default Toggle;
export {IToggleProps, IToggleClassNameContract};
