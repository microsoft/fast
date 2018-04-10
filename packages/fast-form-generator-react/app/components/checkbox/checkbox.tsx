import * as React from "react";

export interface ICheckboxProps {
    toggle: boolean;
    optionalToggle?: boolean;
}

export default class Checkbox extends React.Component<ICheckboxProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.toggle.toString()}
                <br />
                {typeof this.props.optionalToggle !== "undefined" ? this.props.optionalToggle.toString() : "undefined"}
            </span>
        );
    }
}
