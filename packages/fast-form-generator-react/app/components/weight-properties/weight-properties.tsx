import * as React from "react";

export enum tagEnum {
    button = "button",
    span = "span"
}

export interface IWeightPropertiesProps {
    alignHorizontal: string;
    alignVertical: string;
    level: number;
    tag: tagEnum;
    title: string;
    details: string;
    text: string;
}

export default class WeightProperties extends React.Component<IWeightPropertiesProps, {}> {
    public render(): JSX.Element {
        return (
            <this.props.tag>
                {this.props.alignHorizontal}
                {this.props.alignVertical}
                {this.props.level}
                {this.props.title}
                {this.props.details}
                {this.props.tag}
                {this.props.text}
            </this.props.tag>
        );
    }
}
