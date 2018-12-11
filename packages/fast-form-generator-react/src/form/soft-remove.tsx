import * as React from "react";

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
     * The onChange callback
     */
    onChange: () => void;
}

/**
 * Schema form component definition
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
                />
                <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M6 1C8.76 1 11 4 11 4C11 4 8.76 7 6 7C3.24 7 1 4 1 4C1 4 3.24 1 6 1ZM6 0C2.77 0 0.300005 3.26 0.200005 3.4C-0.0599951 3.75 -0.0599951 4.24 0.200005 4.6C0.300005 4.74 2.77 8 6 8C9.23001 8 11.7 4.74 11.8 4.6C12.06 4.25 12.06 3.76 11.8 3.4C11.7 3.26 9.23001 0 6 0Z" />
                    <path d="M6 2C7.1 2 8 2.9 8 4C8 5.1 7.1 6 6 6C4.9 6 4 5.1 4 4C4 2.9 4.9 2 6 2Z" />
                </svg>
            </React.Fragment>
        );
    }
}

export default SoftRemove;
