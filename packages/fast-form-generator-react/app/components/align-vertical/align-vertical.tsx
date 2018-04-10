import * as React from "react";

export enum alignVerticalEnum {
    top = "top",
    bottom = "bottom",
    center = "center"
}

export interface IAlignVerticalProps {
    alignVertical: alignVerticalEnum;
}

export default class AlignVertical extends React.Component<IAlignVerticalProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.alignVertical}
            </span>
        );
    }
}
