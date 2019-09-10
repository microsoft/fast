import React from "react";

export interface SoftRemoveProps {
    /**
     * The className to apply to the input element
     */
    className: string;

    /**
     * The checked value for the input element
     */
    checked: boolean;

    /**
     * The disabled state for the input element
     */
    disabled: boolean;

    /**
     * The onChange callback
     */
    onChange: () => void;
}

/**
 * A component that allows:
 * - deletion of data which is intended to be cached
 * - addition of the removed data via a cache
 * @extends React.Component
 */
class SoftRemove extends React.Component<SoftRemoveProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <input
                    type="checkbox"
                    className={this.props.className}
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
                {this.renderIcon()}
            </React.Fragment>
        );
    }

    private renderIcon(): React.ReactNode {
        if (this.props.checked) {
            return (
                <svg
                    width="12"
                    height="14"
                    viewBox="0 0 10 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.4,6.8c0.2-0.5,0.3-1.1,0.3-1.6c0-0.4-0.1-0.8-0.2-1.1C9.4,3.6,9.3,3.3,9.1,3C8.9,2.6,8.7,2.4,8.4,2.1S7.9,1.6,7.5,1.4
                        C7.2,1.2,6.9,1.1,6.5,1C6.1,0.9,5.8,0.8,5.4,0.8c-0.3,0-0.7,0-0.9,0.1l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0C4.1,1,3.9,1.1,3.6,1.2l0,0
                        c0,0,0,0,0,0c0,0,0,0,0,0l0,0C3.4,1.3,3.2,1.4,2.9,1.6l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0C2.7,1.7,2.5,1.9,2.3,2.1l0,0
                        C2.1,2.3,1.9,2.5,1.7,2.7l0,0C1.6,2.8,1.5,2.9,1.5,3V1V0.8H1.2H0.5H0.3V1v3.8V5h0.2h3.8h0.2V4.8V4V3.8H4.2h-2
                        c0.2-0.2,0.3-0.3,0.5-0.5l0,0C3,3.1,3.2,2.8,3.5,2.6v0l0,0C3.7,2.4,4,2.3,4.3,2.2l0,0C4.6,2,5,2,5.4,2c0.4,0,0.8,0.1,1.2,0.3l0,0
                        c0.4,0.2,0.7,0.4,1,0.7s0.5,0.6,0.7,1l0,0c0.2,0.4,0.3,0.8,0.3,1.2c0,0.4-0.1,0.8-0.2,1.2C8.1,6.7,7.9,7,7.6,7.3l0,0l-4.9,4.9
                        l-0.1,0.1l0.1,0.1L3.2,13l0.1,0.1L3.5,13l4.9-4.9l0,0C8.8,7.7,9.1,7.3,9.4,6.8L9.4,6.8C9.4,6.8,9.4,6.8,9.4,6.8
                        C9.4,6.8,9.4,6.8,9.4,6.8L9.4,6.8z"
                    />
                </svg>
            );
        }

        return (
            <svg
                width="12"
                height="14"
                viewBox="0 0 10 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9.5,0.8H8.8H8.5V1v2C8.5,2.9,8.4,2.8,8.3,2.7l0,0C8.1,2.5,7.9,2.3,7.7,2.1l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0
                    C7.5,1.9,7.3,1.7,7.1,1.6l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0C6.8,1.4,6.6,1.3,6.4,1.2l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0
                    C6.1,1.1,5.9,1,5.6,0.9l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0C5.3,0.9,5,0.8,4.6,0.8C4.2,0.8,3.9,0.9,3.5,1c-0.4,0.1-0.7,0.2-1,0.4
                    C2.1,1.6,1.9,1.8,1.6,2.1S1.1,2.6,0.9,3C0.7,3.3,0.6,3.6,0.5,4C0.4,4.4,0.3,4.7,0.3,5.1c0,0.6,0.1,1.1,0.3,1.6l0,0
                    c0.2,0.5,0.5,1,0.9,1.4l0,0L6.5,13l0.1,0.1L6.8,13l0.5-0.5l0.1-0.1l-0.1-0.1L2.4,7.3l0,0C2.1,7,1.9,6.7,1.7,6.3
                    C1.6,5.9,1.5,5.5,1.5,5.1c0-0.4,0.1-0.8,0.2-1.2c0.2-0.4,0.4-0.7,0.7-1c0.3-0.3,0.6-0.5,1-0.7l0,0C3.8,2.1,4.2,2,4.6,2
                    C5,2,5.4,2,5.7,2.2l0,0C6,2.3,6.3,2.4,6.5,2.6l0,0C6.8,2.8,7,3.1,7.3,3.3l0,0c0.1,0.2,0.3,0.3,0.5,0.5h-2H5.5V4v0.8V5h0.2h3.8h0.2
                    V4.8V1V0.8H9.5z"
                />
            </svg>
        );
    }
}

export default SoftRemove;
