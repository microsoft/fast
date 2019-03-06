import React from "react";

export enum TextareaTags {
    button = "button",
    span = "span",
}

export interface TextareaProps {
    tag: TextareaTags;
    text: string;
}

/**
 * This test components API should have:
 * - a required textarea property which should display as a select dropdown because it is an enum
 * - a required textarea which should display as a text box
 */
export default class Textarea extends React.Component<TextareaProps, {}> {
    public static displayName: string = "Text field";
    public render(): JSX.Element {
        return <this.props.tag>{this.props.text}</this.props.tag>;
    }
}
