import * as React from "react";

export enum WeightPropertiesTags {
    button = "button",
    span = "span"
}

export interface IWeightPropertiesProps {
    alignHorizontal: string;
    alignVertical: string;
    level: number;
    tag: WeightPropertiesTags;
    title: string;
    details: string;
    text: string;
}

/**
 * This test components API should have:
 * - a number of required property which maps to a configuration which will organise them by weight
 */
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
