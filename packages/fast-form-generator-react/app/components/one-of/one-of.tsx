import * as React from "react";

export interface IOneOfProps {
    number?: number;
    string?: string;
}

export default class OneOf extends React.Component<IOneOfProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.number}{this.props.string}
            </span>
        );
    }
}
