import * as React from "react";

export interface SortableConfig {
    key: string;
    index: number;
    value: any;
}

export enum axis {
    x = "x",
    y = "y",
}

export interface SortingProps {
    pressDelay: number;
    lockAxis: axis;
}

export const sortingProps: SortingProps = {
    pressDelay: 150,
    lockAxis: axis.y,
};

export interface SortableListItemProps {
    className?: string;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export class SortableListItem extends React.Component<SortableListItemProps, {}> {
    public render(): JSX.Element {
        return (
            <li draggable={true} id={this.props.id} className={this.props.className}>
                {this.props.children}
            </li>
        );
    }
}
