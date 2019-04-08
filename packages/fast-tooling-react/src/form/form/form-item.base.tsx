import React from "react";
import { get } from "lodash-es";
import BadgeControl from "./badge-control";
import SoftRemove from "./soft-remove";
import FormItemCommon from "./form-item.props";

/**
 * Schema form component definition
 * This is the base component for form item components.
 * @extends React.Component
 */
abstract class FormItemBase<P, S> extends React.Component<P & FormItemCommon, S> {
    public inputRef: React.RefObject<HTMLInputElement>;

    public textAreaRef: React.RefObject<HTMLTextAreaElement>;

    public selectRef: React.RefObject<HTMLSelectElement>;
    private cache: string;

    private formItemRef:
        | React.RefObject<HTMLInputElement>
        | React.RefObject<HTMLTextAreaElement>
        | React.RefObject<HTMLSelectElement>;

    constructor(props: P & FormItemCommon) {
        super(props);

        this.inputRef = React.createRef();
        this.textAreaRef = React.createRef();
        this.selectRef = React.createRef();
    }

    public componentDidMount(): void {
        this.formItemRef =
            this.inputRef.current !== null
                ? this.inputRef
                : this.textAreaRef.current !== null
                    ? this.textAreaRef
                    : this.selectRef.current !== null
                        ? this.selectRef
                        : null;

        this.updateValidity();
    }

    public componentDidUpdate(prevProps: P & FormItemCommon): void {
        if (prevProps.invalidMessage !== this.props.invalidMessage) {
            this.updateValidity();
        }
    }

    public renderSoftRemove(className: string): React.ReactNode {
        if (!this.props.required) {
            return (
                <SoftRemove
                    className={className}
                    checked={this.props.data !== undefined}
                    onChange={this.handleSoftRemove}
                    disabled={this.props.data === undefined && this.cache === undefined}
                />
            );
        }
    }

    public renderBadge(className: string): React.ReactNode {
        if (this.props.badge) {
            return (
                <BadgeControl
                    className={className}
                    type={this.props.badge}
                    description={this.props.badgeDescription}
                />
            );
        }
    }

    /**
     * Renders an indicator that signifies that the value
     * displayed is a default value
     */
    public renderDefaultValueIndicator(className: string): React.ReactNode {
        if (
            typeof this.props.data === "undefined" &&
            typeof this.props.default !== "undefined"
        ) {
            return (
                <svg
                    className={className}
                    viewBox="0 0 16 16"
                    height="14"
                    width="14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>This is the default value</title>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.86 1.252A6.795 6.795 0 0 0 8 1c-.645 0-1.268.084-1.868.252a7.01 7.01 0 0 0-3.088 1.8c-.42.422-.785.893-1.093 1.414a7.052 7.052 0 0 0-.707 1.675A7.015 7.015 0 0 0 1 8c0 .645.081 1.268.244 1.868.168.594.404 1.152.707 1.674a7.44 7.44 0 0 0 1.093 1.414c.427.42.898.785 1.414 1.093.522.303 1.08.539 1.674.707.6.163 1.223.244 1.868.244s1.265-.081 1.86-.244a7.055 7.055 0 0 0 1.674-.707 7.103 7.103 0 0 0 2.507-2.507 6.8 6.8 0 0 0 .707-1.674C14.916 9.268 15 8.645 15 8s-.084-1.265-.252-1.86a6.621 6.621 0 0 0-.707-1.674 6.71 6.71 0 0 0-1.094-1.413 6.712 6.712 0 0 0-1.413-1.094 6.622 6.622 0 0 0-1.675-.707zm-.287 12.46c-.504.141-1.029.211-1.573.211a5.848 5.848 0 0 1-2.987-.808 6.191 6.191 0 0 1-1.203-.925 6.193 6.193 0 0 1-.925-1.203A5.852 5.852 0 0 1 2.077 8a5.851 5.851 0 0 1 .808-2.987 6.023 6.023 0 0 1 2.129-2.129A5.852 5.852 0 0 1 8 2.078a5.851 5.851 0 0 1 4.181 1.742A5.816 5.816 0 0 1 13.924 8a5.848 5.848 0 0 1-.808 2.987 6.022 6.022 0 0 1-2.128 2.128 5.852 5.852 0 0 1-1.414.598zm-2.65-1.724l5.225-5.225-.757-.757-4.468 4.468L4.61 8.16l-.757.757 3.071 3.071z"
                    />
                </svg>
            );
        }
    }

    public handleSoftRemove = (): void => {
        if (typeof this.props.data !== "undefined") {
            this.cache = this.props.data;

            return this.props.onChange(this.props.dataLocation, undefined);
        } else {
            return this.props.onChange(this.props.dataLocation, this.cache);
        }
    };

    /**
     * Renders an invalid message
     */
    public renderInvalidMessage = (className: string): React.ReactNode => {
        if (this.props.displayValidationInline) {
            return <div className={className}>{this.props.invalidMessage}</div>;
        }
    };

    /**
     * updates the validity
     */
    public updateValidity = (): void => {
        const formItemElement: HTMLElement = get(this, "formItemRef.current");

        if (formItemElement !== null && typeof formItemElement !== "undefined") {
            this.formItemRef.current.setCustomValidity(this.props.invalidMessage);
        }
    };

    /**
     * Reports the current validity of the form item
     */
    public reportValidity = (): void => {
        this.updateValidity();

        if (this.props.displayValidationBrowserDefault) {
            this.formItemRef.current.reportValidity();
        }
    };
}

export default FormItemBase;
