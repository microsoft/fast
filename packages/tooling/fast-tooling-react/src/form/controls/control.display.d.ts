import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DisplayControlClassNameContract } from "./control.display.style";
import { DisplayControlProps } from "./control.display.props";
/**
 * Form control definition
 */
declare class DisplayControl extends React.Component<
    DisplayControlProps & ManagedClasses<DisplayControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        DisplayControlProps & ManagedClasses<DisplayControlClassNameContract>
    >;
    render(): React.ReactNode;
    /**
     * Dummy onChange handler
     *
     * Form elements will not validate against read-only form items
     * therefore a value and onChange handler must still be supplied
     * even if there is no intention to update the value.
     */
    private handleInputChange;
    private getDisplayValue;
}
export { DisplayControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, DisplayControlClassNameContract, {}>,
    any
>;
export default _default;
