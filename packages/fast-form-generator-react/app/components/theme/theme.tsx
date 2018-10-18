import * as React from "react";

export enum Themes {
    light = "light",
    dark = "dark",
}

export interface ThemeProps {
    theme: Themes;
}

/**
 * This test components API should have:
 * - a required property which maps to a configuration
 */
export default class Theme extends React.Component<ThemeProps, {}> {
    public render(): JSX.Element {
        return <span>{this.props.theme}</span>;
    }
}
