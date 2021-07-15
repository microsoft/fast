import React from "react";
/**
 * Control template definition
 *
 * This is the standard control template that may be used for a CSS plugin.
 */
export default class CSSStandardControlTemplate extends React.Component {
    render() {
        return this.renderControl();
    }
    renderControl() {
        return this.props.control(this.getConfig());
    }
    getConfig() {
        return {
            css: this.props.css,
            onChange: this.props.onChange,
        };
    }
}
