import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ControlTemplateUtilities from "./template.control.utilities";
import { BareControlTemplateClassNameContract } from "./template.control.bare.style";
import { BareControlTemplateProps } from "./template.control.bare.props";
/**
 * Control template definition
 */
declare class BareControlTemplate extends ControlTemplateUtilities<
    BareControlTemplateProps & ManagedClasses<BareControlTemplateClassNameContract>,
    {}
> {
    static defaultProps: Partial<
        BareControlTemplateProps & ManagedClasses<BareControlTemplateClassNameContract>
    >;
    render(): React.ReactNode;
}
export { BareControlTemplate };
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        BareControlTemplateProps,
        BareControlTemplateClassNameContract,
        {}
    >,
    any
>;
export default _default;
