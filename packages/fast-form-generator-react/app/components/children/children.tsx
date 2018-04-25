import * as React from "react";

/**
 * This test components API should have:
 * - no properties but should pass children
 */
export default class Children extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.children}
            </span>
        );
    }
}
