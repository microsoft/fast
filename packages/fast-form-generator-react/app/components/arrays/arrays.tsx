import * as React from "react";

export interface IArrayProps {
    strings: string[];
}

export default class Array extends React.Component<IArrayProps, {}> {

    public render(): JSX.Element {
        return (
            <span>
                {this.renderStrings()}
            </span>
        );
    }

    private renderStrings(): JSX.Element[] {
        return this.props.strings.map((stringItem: string, index: number) => {
            return (
                <span key={index}>{stringItem}</span>
            );
        });
    }
}
