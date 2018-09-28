import * as React from "react";

export enum TextFieldTags {
    button = "button",
    span = "span"
}

export interface ITextFieldProps {
    tag: TextFieldTags;
    text: string;
}

/**
 * This test components API should have:
 * - a required text-field property which should display as a select dropdown because it is an enum
 * - a required text-field which should display as a text box
 */
export default class TextField extends React.Component<ITextFieldProps, {}> {
    public static displayName: string = "Text field";

    public render(): JSX.Element {
        return (
            <this.props.tag>
                {this.props.text}
            </this.props.tag>
        );
    }
}
