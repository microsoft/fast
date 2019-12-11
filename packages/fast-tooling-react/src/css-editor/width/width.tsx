import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSWidthHandledProps,
    CSSWidthProps,
    CSSWidthUnhandledProps,
} from "./width.props";
import { CSSWidthClassNameContract } from "./width.style";
import { classNames } from "@microsoft/fast-web-utilities";

export default class CSSWidth extends Foundation<
    CSSWidthHandledProps,
    CSSWidthUnhandledProps,
    {}
> {
    public static displayName: string = "CSSWidth";

    public static defaultProps: Partial<CSSWidthProps> = {
        value: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSWidthHandledProps> = {
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
            cssWidth,
            cssWidth__disabled,
            cssWidth_input,
        }: Partial<CSSWidthClassNameContract> = this.props.managedClasses;

        return (
            <div
                className={classNames(cssWidth, [
                    cssWidth__disabled,
                    this.props.disabled,
                ])}
            >
                <input
                    className={cssWidth_input}
                    type={"text"}
                    id={this.props.dataLocation}
                    value={this.props.value}
                    disabled={this.props.disabled}
                    onChange={this.handleWidthOnChange}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                    ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                />
            </div>
        );
    }

    private handleWidthOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            value: e.target.value || void 0,
        });
    };
}
