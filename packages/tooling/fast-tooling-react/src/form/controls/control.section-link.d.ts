import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { SectionLinkControlClassNameContract } from "./control.section-link.style";
import { SectionLinkControlProps } from "./control.section-link.props";
/**
 * Form control definition
 */
declare class SectionLinkControl extends React.Component<
    SectionLinkControlProps & ManagedClasses<SectionLinkControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        SectionLinkControlProps & ManagedClasses<SectionLinkControlClassNameContract>
    >;
    render(): React.ReactNode;
    private handleUpdateSection;
}
export { SectionLinkControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, SectionLinkControlClassNameContract, {}>,
    any
>;
export default _default;
