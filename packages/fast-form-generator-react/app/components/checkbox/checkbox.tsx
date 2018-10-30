import * as React from "react";

export interface CheckboxProps {
    toggle: boolean;
    optionalToggle?: boolean;
}

/**
 * This test components API should have:
 * - a required property which should display as a checkbox
 * - an optional property which should display as a checkbox
 */
export default class Checkbox extends React.Component<CheckboxProps, {}> {
    public render(): JSX.Element {
        return (
            <span>
                {this.props.toggle.toString()}
                <br />
                {typeof this.props.optionalToggle !== "undefined"
                    ? this.props.optionalToggle.toString()
                    : "undefined"}
            </span>
        );
    }
}
