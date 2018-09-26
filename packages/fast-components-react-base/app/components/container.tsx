
import * as React from "react";

export interface IContainerProps {
    slot: string;
}

export default class Container extends React.Component<IContainerProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
