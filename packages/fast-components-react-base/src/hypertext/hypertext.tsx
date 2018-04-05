import * as React from "react";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "../foundation";
import {IHypertextHandledProps, IHypertextManagedClasses, IHypertextUnhandledProps} from "./hypertext.props";
import {IHypertextClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/* tslint:disable-next-line */
class Hypertext extends Foundation<IHypertextHandledProps & IManagedClasses<IHypertextClassNameContract>,  React.AllHTMLAttributes<HTMLAnchorElement>, {}> {
    protected handledProps: HandledProps<IHypertextHandledProps & IManagedClasses<IHypertextClassNameContract>> = {
        managedClasses: void 0,
    };

    private generateAttributes() {
        let attributes = {};

        if (this.props.href) {
            attributes["href"] = this.props.href;
        }
        
        return attributes;
    }
    
    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLAnchorElement> {
        return (
            <a
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                {...this.generateAttributes()}
            >
                {this.props.children}
            </a>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.hypertext);
    }
}


export default Hypertext;
export * from "./hypertext.props";
export {IHypertextClassNameContract};

