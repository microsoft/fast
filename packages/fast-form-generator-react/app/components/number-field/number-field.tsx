import * as React from "react";

export enum Levels {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4
}

export interface INumberFieldProps {
    level: Levels;
    quantity: number;
}

/**
 * This test components API should have:
 * - a required number-field property which should display as a select dropdown because it is an enum
 * - a required number-field which should display as a text box
 */
export default class NumberField extends React.Component<INumberFieldProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.level} - {this.props.quantity}
            </span>
        );
    }
}
