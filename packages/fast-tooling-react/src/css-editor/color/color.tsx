import React from "react";
import { get } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSColorHandledProps,
    CSSColorProps,
    CSSColorUnhandledProps,
} from "./color.props";
import { CSSColorClassNameContract } from "./color.style";
import { classNames } from "@microsoft/fast-web-utilities";

export default class CSSColor extends Foundation<
    CSSColorHandledProps,
    CSSColorUnhandledProps,
    {}
> {
    public static displayName: string = "CSSColor";

    public static defaultProps: Partial<CSSColorProps> = {
        value: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSColorHandledProps> = {
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
            cssColor_colorInputRegion,
            cssColor_input,
        }: Partial<CSSColorClassNameContract> = this.props.managedClasses;

        return (
            <div className={this.generateClassNames()}>
                <div
                    className={cssColor_colorInputRegion}
                    style={{
                        background: this.props.value,
                    }}
                >
                    <input
                        type={"color"}
                        style={{ opacity: 0, width: "100%" }}
                        onChange={this.handleColorOnChange}
                        value={this.props.value}
                        disabled={this.props.disabled}
                        onFocus={this.props.reportValidity}
                        onBlur={this.props.updateValidity}
                    />
                </div>
                <input
                    className={cssColor_input}
                    type={"text"}
                    id={this.props.dataLocation}
                    value={this.props.value}
                    disabled={this.props.disabled}
                    ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                    onChange={this.handleColorOnChange}
                    onFocus={this.props.reportValidity}
                    onBlur={this.props.updateValidity}
                />
            </div>
        );
    }

    protected generateClassNames(): string {
        const {
            cssColor,
            cssColor__disabled,
        }: Partial<CSSColorClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(
            classNames(cssColor, [cssColor__disabled, this.props.disabled])
        );
    }

    private handleColorOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            value: e.target.value || void 0,
        });
    };
}
