import * as React from "react";

export interface ArrayObject {
    string: string;
}

export interface ArrayProps {
    strings: string[];
    objects: ArrayObject[];
}

/**
 * This test components API should have:
 * - a required string array
 */
export default class Array extends React.Component<ArrayProps, {}> {

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
            return this.props.objects.map((objectItem: ArrayObject, index: number) => {
                return (
                    <span key={index}>{objectItem.string}</span>
                );
            });
        }
    }
}
