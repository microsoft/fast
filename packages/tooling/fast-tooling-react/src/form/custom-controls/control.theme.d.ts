import React from "react";
import { ThemeControlClassNameContract } from "./control.theme.style";
import { ThemeControlProps } from "./control.theme.props";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
/**
 * Custom form control definition
 */
declare class ThemeControl extends React.Component<
    ThemeControlProps & ManagedClasses<ThemeControlClassNameContract>,
    {}
> {
    static displayName: string;
    static defaultProps: Partial<
        ThemeControlProps & ManagedClasses<ThemeControlClassNameContract>
    >;
    render(): React.ReactNode;
    private onChange;
    private isChecked;
    private getInputClassName;
    private getThemeLabel;
    private renderInput;
}
export { ThemeControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, ThemeControlClassNameContract, {}>,
    any
>;
export default _default;
