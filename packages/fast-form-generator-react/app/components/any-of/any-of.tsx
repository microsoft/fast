import * as React from "react";

export interface AnyOfProps {
    number?: number;
    string?: string;
}

/**
 * This test components API should have:
 * - two optional properties which in the JSON schema correspond to an anyOf
 */
export default class AnyOf extends React.Component<AnyOfProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.number}
                {this.props.string}
            </span>
        );
    }
}
