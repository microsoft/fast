import * as React from "react";

export enum tagEnum {
    button = "button",
    span = "span"
}

export interface IGeneralExampleProps {
    alignHorizontal: string;
    alignVertical: string;
    level: number;
    tag: tagEnum;
    title: string;
    details: string;
    text: string;
    checkbbox: boolean;
}

/**
 * This test components API should have:
 * - a number of required property which maps to a configuration which will organise them by weight
 */
export default class GeneralExample extends React.Component<IGeneralExampleProps, {}> {
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
                {this.props.checkbbox}
            </this.props.tag>
        );
    }
}
