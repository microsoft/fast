import * as React from "react";

export interface IAnyOfProps {
    number?: number;
    string?: string;
}

export default class AnyOf extends React.Component<IAnyOfProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.number}{this.props.string}
            </span>
        );
    }
}
