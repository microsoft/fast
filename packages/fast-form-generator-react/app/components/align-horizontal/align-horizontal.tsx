import * as React from "react";

export enum AlignHorizontalPositions {
    left = "left",
    right = "right"
}

export interface AlignHorizontalProps {
    alignHorizontal: AlignHorizontalPositions;
}

/**
 * This test components API should have:
 * - a required property which maps to a configuration
 */
export default class AlignHorizontal extends React.Component<AlignHorizontalProps, {}> {
    public render(): JSX.Element {
        return <span>{this.props.alignHorizontal}</span>;
    }
}
