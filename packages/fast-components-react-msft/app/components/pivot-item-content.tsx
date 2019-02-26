import * as React from "react";

export interface PivotItemContentProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * A stand-in a mock pivot content
 */
export default class PivotItemContent extends React.Component<PivotItemContentProps, {}> {
    public render(): React.ReactNode {
        return <div className={this.props.className}>{this.props.children}</div>;
    }
}
