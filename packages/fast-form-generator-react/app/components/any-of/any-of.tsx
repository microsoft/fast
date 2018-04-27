import * as React from "react";

export interface IAnyOfProps {
    number?: number;
    string?: string;
}

/**
 * This test components API should have:
 * - two optional properties which in the JSON schema correspond to an anyOf
 */
export default class AnyOf extends React.Component<IAnyOfProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.number}{this.props.string}
            </span>
        );
    }
}
