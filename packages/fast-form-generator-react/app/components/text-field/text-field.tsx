import * as React from "react";

export enum tagEnum {
    button = "button",
    span = "span"
}

export interface ITextFieldProps {
    tag: tagEnum;
    text: string;
}

export default class TextField extends React.Component<ITextFieldProps, {}> {
    public render(): JSX.Element {
        return (
            <this.props.tag>
                {this.props.text}
            </this.props.tag>
        );
    }
}
