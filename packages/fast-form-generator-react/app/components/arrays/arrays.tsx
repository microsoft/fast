import * as React from "react";

export interface IArrayProps {
    strings: string[];
}

/**
 * This test components API should have:
 * - a required string array
 */
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
