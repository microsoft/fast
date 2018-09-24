import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "../foundation";
import { DividerRoles, IDividerHandledProps, IDividerManagedClasses, IDividerUnhandledProps } from "./divider.props";
import { IDividerClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/* tslint:disable-next-line */
class Divider extends Foundation<
    IDividerHandledProps & IManagedClasses<IDividerClassNameContract>,
    React.HTMLAttributes<HTMLHRElement>,
    {}
> {
    public static displayName: string = "Divider";

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
        if (this.props.role && this.props.role !== DividerRoles.separator) {
            return ({role: DividerRoles[this.props.role]});
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.divider"));
    }
}

export default Divider;
export * from "./divider.props";
export { IDividerClassNameContract };
