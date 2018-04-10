import * as React from "react";

export enum themeEnum {
    light = "light",
    dark = "dark"
}

export interface IThemeProps {
    theme: themeEnum;
}

export default class Theme extends React.Component<IThemeProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.theme}
            </span>
        );
    }
}
