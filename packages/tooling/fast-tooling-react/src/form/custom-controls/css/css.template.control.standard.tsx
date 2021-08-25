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
    public render(): React.ReactNode {
        return this.renderControl();
    }

    public renderControl(): React.ReactNode {
        return this.props.control(this.getConfig());
    }

    public getConfig(): CSSControlConfig {
        return {
            css: this.props.css,
            onChange: this.props.onChange,
            value: this.props.value,
        };
    }
}
