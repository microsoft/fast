import React from "react";

interface TextareaProps {
    text: string;
}

export default class Textarea extends React.Component<TextareaProps, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.text}</div>;
    }
}
