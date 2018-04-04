import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, {HandledProps} from "../foundation";
import {DividerRole, IDividerHandledProps} from './divider.props';
import {IDividerClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

class Divider extends Foundation<IDividerHandledProps & IManagedClasses<IDividerClassNameContract>, React.AllHTMLAttributes<HTMLElement>, {}> {

    protected handledProps: HandledProps<IDividerHandledProps & IManagedClasses<IDividerClassNameContract>> = {
        managedClasses: void 0,
        role: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHRElement> {
        return (
            <hr
                {...this.unhandledProps()}
                {...this.generateAttributes()}
                className={this.generateClassNames()}
            />
        );
    } 

    /**
     * Generates the attributes
     */
    protected generateAttributes(): React.HTMLAttributes<HTMLHRElement> {

        // Do not render role="separator" on page because it's intrinsically set.
        if (this.props.role && this.props.role !== DividerRole.separator) {
            return ({role: this.props.role});
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.divider);
    }
}

export default Divider;
export {IDividerHandledProps, IDividerClassNameContract, DividerRole};
