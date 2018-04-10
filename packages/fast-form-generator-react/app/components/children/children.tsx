import * as React from "react";

export default class Children extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.children}
            </span>
        );
    }
}
