import React from "react";

export interface ChildrenProps {
    /**
     * React children using a render prop
     */
    render: (className: string) => React.ReactNode;
}

/**
 * This test components API should have:
 * - no properties but should pass children
 */
export default class ChildrenWithRenderProp extends React.Component<ChildrenProps, {}> {
    public static displayName: string = "ChildrenWithRenderProp";

    public render(): JSX.Element {
        return <span>{this.props.render}</span>;
    }
}
