import React from "react";
import Array, { ArrayProps } from "../arrays";
import Objects, { ObjectsProps } from "../objects";
import Theme, { ThemeProps } from "../theme";
export enum GeneralTags {
    button = "button",
    span = "span",
}
export interface GeneralProps {
    alignHorizontal: string;
    alignVertical: string;
    level: number;
    level2: number;
    tag: GeneralTags;
    title: string;
    details: string;
    text: string;
    checkbox: boolean;
    checkbox2: boolean;
    objects: ObjectsProps;
    array: ArrayProps;
    theme: ThemeProps;
    children: any;
}
/**
 * This test components API should have:
 * - a number of required property which maps to a configuration which will organise them by weight
 */
export default class General extends React.Component<GeneralProps, {}> {
    public render(): JSX.Element {
        return (
            <this.props.tag>
                {this.props.title}
                {this.props.alignHorizontal}
                {this.props.checkbox}
                {this.props.alignVertical}
                {this.props.checkbox2}
                {this.props.level}
                {this.props.title}
                {this.props.details}
                {this.props.tag}
                {this.props.level2}
                {this.props.text}
                {this.props.objects}
                {this.props.array}
                {this.props.theme}
                {this.props.children}
            </this.props.tag>
        );
    }
}
