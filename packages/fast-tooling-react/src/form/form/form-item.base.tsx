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
