import * as React from "react";

export interface IArrayObject {
    string: string;
}

export interface IArrayProps {
    strings: string[];
    objects: IArrayObject[];
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
                {this.renderObjects()}
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

    private renderObjects(): JSX.Element[] {
        if (this.props.objects) {
            return this.props.objects.map((objectItem: IArrayObject, index: number) => {
                return (
                    <span key={index}>{objectItem.string}</span>
                );
            });
        }
    }
}
