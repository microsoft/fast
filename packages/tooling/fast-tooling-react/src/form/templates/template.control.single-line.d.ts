import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import { SingleLineControlTemplateClassNameContract } from "./template.control.single-line.style";
import { SingleLineControlTemplateProps } from "./template.control.single-line.props";
/**
 * Control template definition
 */
declare class SingleLineControlTemplate extends ControlTemplateUtilities<
    SingleLineControlTemplateProps &
        ManagedClasses<SingleLineControlTemplateClassNameContract>,
    {}
> {
    static defaultProps: Partial<
        SingleLineControlTemplateProps &
            ManagedClasses<SingleLineControlTemplateClassNameContract>
    >;
    render(): React.ReactNode;
}
export { SingleLineControlTemplate };
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        SingleLineControlTemplateProps,
        SingleLineControlTemplateClassNameContract,
        {}
    >,
    any
>;
export default _default;
