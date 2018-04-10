import * as React from "react";

export enum alignHorizontalEnum {
    left = "left",
    right = "right"
}

export interface IAlignHorizontalProps {
    alignHorizontal: alignHorizontalEnum;
}

export default class AlignHorizontal extends React.Component<IAlignHorizontalProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.alignHorizontal}
            </span>
        );
    }
}
