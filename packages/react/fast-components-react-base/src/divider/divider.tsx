import { DividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    DividerHandledProps,
    DividerProps,
    DividerRoles,
    DividerUnhandledProps,
} from "./divider.props";

class Divider extends Foundation<DividerHandledProps, DividerUnhandledProps, {}> {
    public static displayName: string = `${DisplayNamePrefix}Divider`;

    public static defaultProps: Partial<DividerProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<DividerHandledProps> = {
        managedClasses: void 0,
        role: void 0,
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
            return { role: DividerRoles[this.props.role] };
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.divider));
    }
}

export default Divider;
export * from "./divider.props";
export { DividerClassNameContract };
