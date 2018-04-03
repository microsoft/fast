import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import { IDividerProps } from './divider.props';
import { IDividerClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

/**
 * Divider component class
 */
class Divider extends Foundation<IDividerProps & IManagedClasses<IDividerClassNameContract>, React.AllHTMLAttributes<HTMLElement>, {}> {

    protected handledProps: HandledProps<IDividerProps & IManagedClasses<IDividerClassNameContract>> = {
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLHRElement> {
        return (
            <hr
                {...this.unhandledProps()}
                //{...this.generateAttributes()}
                //className={this.generateClassNames()}
            />
        );
    } 
}

export default Divider;
export {IDividerProps, IDividerClassNameContract};
