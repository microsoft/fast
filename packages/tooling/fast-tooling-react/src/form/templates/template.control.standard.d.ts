import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import { StandardControlTemplateClassNameContract } from "./template.control.standard.style";
import { StandardControlTemplateProps } from "./template.control.standard.props";
/**
 * Control template definition
 */
declare class StandardControlTemplate extends ControlTemplateUtilities<
    StandardControlTemplateProps &
        ManagedClasses<StandardControlTemplateClassNameContract>,
    {}
> {
    static defaultProps: Partial<
        StandardControlTemplateProps &
            ManagedClasses<StandardControlTemplateClassNameContract>
    >;
    render(): React.ReactNode;
    private renderControl;
}
export { StandardControlTemplate };
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        StandardControlTemplateProps,
        StandardControlTemplateClassNameContract,
        {}
    >,
    any
>;
export default _default;
