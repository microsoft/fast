import * as React from "react";

export interface IObjectWithChildren {
    nestedObjectChildren: JSX.Element;
}

export interface IChildrenProps {
    /**
     * Children which are restricted to a subset of childOptions via the JSON schema
     */
    restrictedWithChildren: JSX.Element[] | JSX.Element;

    /**
     * Children which are restricted to a subset of childOptions via the JSON schema
     * and include the React default children (string)
     */
    restrictedChildrenWithReactDefaults: JSX.Element[] | JSX.Element;

    /**
     * An object containing a property that are children
     */
    objectContainingNestedChildren?: IObjectWithChildren;
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
