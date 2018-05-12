import * as React from "react";

export enum AlignVerticalPositions {
    top = "top",
    bottom = "bottom",
    center = "center"
}

export interface IAlignVerticalProps {
    alignVertical: AlignVerticalPositions;
}

/**
 * This test components API should have:
 * - a required property which maps to a configuration
 */
export default class AlignVertical extends React.Component<IAlignVerticalProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.alignVertical}
            </span>
        );
    }
}
