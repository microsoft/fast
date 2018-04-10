import * as React from "react";

export enum levelEnum {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4
}

export interface INumberFieldProps {
    level: levelEnum;
    quantity: number;
}

export default class NumberField extends React.Component<INumberFieldProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.level} - {this.props.quantity}
            </span>
        );
    }
}
