import * as React from "react";
import SoftRemove from "./soft-remove";
import FormItemCommon from "./form-item";

/**
 * Schema form component definition
 * This is the base component for form item components.
 * @extends React.Component
 */
abstract class FormItemBase<P, S> extends React.Component<P & FormItemCommon, S> {
    private cache: string;

    public renderSoftRemove(className: string): React.ReactNode {
        if (!this.props.required) {
            return (
                <SoftRemove
                    className={className}
                    checked={this.props.data !== undefined}
                    onChange={this.handleSoftRemove}
                />
            );
        }
    }

    public handleSoftRemove = (): void => {
        if (this.props.data) {
            this.cache = this.props.data;

            return this.props.onChange(this.props.dataLocation, undefined);
        } else {
            return this.props.onChange(this.props.dataLocation, this.cache);
        }
    };
}

export default FormItemBase;
