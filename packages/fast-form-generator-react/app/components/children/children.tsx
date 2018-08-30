import * as React from "react";

export interface IChildrenProps {
    restrictedWithChildren: JSX.Element[] | JSX.Element;
    restrictedChildrenWithReactDefaults: JSX.Element[] | JSX.Element;
    objectContainingNestedChildren: any;
}

/**
 * This test components API should have:
 * - no properties but should pass children
 */
export default class Children extends React.Component<IChildrenProps, {}> {
    public static displayName: string = "Children";

    public render(): JSX.Element {
        return (
            <span>
                {this.props.children}
                {this.props.restrictedWithChildren}
                {this.props.restrictedChildrenWithReactDefaults}
                {this.getObjectContainingNestedChildren()}
            </span>
        );
    }

    private getObjectContainingNestedChildren(): JSX.Element {
        return this.props.objectContainingNestedChildren
            ? this.props.objectContainingNestedChildren.nestedObjectChildren
            : null;
    }
}
