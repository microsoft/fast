import React from "react";
import { CSSControlClassNameContract } from "./control.css.style";
import { CSSControlProps, CSSControlState } from "./control.css.props";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
/**
 * This is currently experimental, any use of the CSS control must include the following
 * imports and register with the DesignSystem
 *
 * import { DesignSystem } from "@microsoft/fast-foundation";
 * import {
 *    fastCheckbox,
 *    fastNumberField,
 *    fastOption,
 *    fastSelect,
 *    fastTextField,
 * } from "@microsoft/fast-components";
 * import {
 *     fastToolingColorPicker,
 * } from "@microsoft/fast-tooling/dist/esm/web-components";
 *
 * DesignSystem.getOrCreate().register(
 *    fastCheckbox(),
 *    fastNumberField(),
 *    fastOption(),
 *    fastSelect(),
 *    fastTextField(),
 *    fastToolingColorPicker({ prefix: "fast-tooling" }),
 * );
 */
/**
 * Custom form control definition for CSS
 */
declare class CSSControl extends React.Component<
    CSSControlProps & ManagedClasses<CSSControlClassNameContract>,
    CSSControlState
> {
    constructor(props: CSSControlProps & ManagedClasses<CSSControlClassNameContract>);
    render(): React.ReactNode;
    private renderCSSProperties;
    private renderCSSProperty;
    private handleMultiplePropertyOnChange;
    private handleOnChange;
    private resolveCSS;
}
export { CSSControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<CSSControlProps, CSSControlClassNameContract, {}>,
    any
>;
export default _default;
