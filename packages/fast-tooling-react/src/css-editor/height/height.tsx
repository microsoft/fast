import React from "react";
import { get } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSHeightHandledProps,
    CSSHeightProps,
    CSSHeightUnhandledProps,
} from "./height.props";
import { CSSHeightClassNameContract } from "./height.style";
import { classNames } from "@microsoft/fast-web-utilities";

export default class CSSHeight extends Foundation<
    CSSHeightHandledProps,
    CSSHeightUnhandledProps,
    {}
> {
    public static displayName: string = "CSSHeight";

    public static defaultProps: Partial<CSSHeightProps> = {
        value: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSHeightHandledProps> = {
        onChange: void 0,
        managedClasses: void 0,
        dataLocation: void 0,
        value: void 0,
        disabled: void 0,
        elementRef: void 0,
        reportValidity: void 0,
        updateValidity: void 0,
    };

    public render(): React.ReactNode {
        const {
            cssHeight,
            cssHeight__disabled,
            cssHeight_input,
        }: Partial<CSSHeightClassNameContract> = this.props.managedClasses;

        return (
            <div
                className={classNames(cssHeight, [
                    cssHeight__disabled,
                    this.props.disabled,
                ])}
            >
                <input
                    className={cssHeight_input}
                    type={"text"}
                    id={this.props.dataLocation}
                    value={this.props.value}
                    disabled={this.props.disabled}
                    onChange={this.handleHeightOnChange}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                    ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                />
            </div>
        );
    }

    private handleHeightOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            value: e.target.value || void 0,
        });
    };
}
