import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import SoftRemove from "./form-item.soft-remove";
import { FormItemCommon } from "./form-item.common";

/**
 * Schema form component definition
 * This is the base component for form item components.
 * @extends React.Component
 */
abstract class FormItemBase<H, D, U, S> extends Foundation<H & FormItemCommon<D>, U, S> {
    public renderSoftRemove(
        className: string,
        handleSoftRemove: () => void
    ): React.ReactNode {
        return (
            <SoftRemove
                className={className}
                checked={this.props.data !== undefined}
                onChange={handleSoftRemove}
            />
        );
    }
}

export default FormItemBase;
