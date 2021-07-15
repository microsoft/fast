import React from "react";
import {
    CSSControlConfig,
    CSSStandardControlTemplateProps,
} from "./css.template.control.standard.props";
/**
 * Control template definition
 *
 * This is the standard control template that may be used for a CSS plugin.
 */
export default class CSSStandardControlTemplate extends React.Component<
    CSSStandardControlTemplateProps,
    {}
> {
    render(): React.ReactNode;
    renderControl(): React.ReactNode;
    getConfig(): CSSControlConfig;
}
