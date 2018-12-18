import React from "react";

export interface PivotItemTabProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * A stand-in a mock pivot tab
 */
export default class PivotItemTab extends React.Component<PivotItemTabProps, {}> {
    public render(): React.ReactNode {
        return <div className={this.props.className}>{this.props.children}</div>;
    }
}
