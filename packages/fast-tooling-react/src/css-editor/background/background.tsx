import React from "react";
import { get } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSBackgroundHandledProps,
    CSSBackgroundProps,
    CSSBackgroundUnhandledProps,
} from "./background.props";
import { CSSBackgroundClassNameContract } from "./background.style";
import { classNames } from "@microsoft/fast-web-utilities";

export default class CSSBackground extends Foundation<
    CSSBackgroundHandledProps,
    CSSBackgroundUnhandledProps,
    {}
> {
    public static displayName: string = "CSSBackground";

    public static defaultProps: Partial<CSSBackgroundProps> = {
        value: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSBackgroundHandledProps> = {
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
            cssBackground_colorInputRegion,
            cssBackground_input,
        }: Partial<CSSBackgroundClassNameContract> = this.props.managedClasses;

        const {
            dataLocation,
            disabled,
            elementRef,
            reportValidity,
            updateValidity,
            value,
        }: CSSBackgroundProps = this.props;

        return (
            <div className={this.generateClassNames()}>
                <div
                    className={cssBackground_colorInputRegion}
                    style={{
                        background: value,
                    }}
                >
                    <input
                        type={"color"}
                        style={{ opacity: 0, width: "100%" }}
                        onChange={this.handleBackgroundOnChange}
                        value={value}
                        disabled={disabled}
                        onFocus={reportValidity}
                        onBlur={updateValidity}
                    />
                </div>
                <input
                    className={cssBackground_input}
                    type={"text"}
                    id={dataLocation}
                    value={value}
                    disabled={disabled}
                    ref={elementRef as React.Ref<HTMLInputElement>}
                    onChange={this.handleBackgroundOnChange}
                    onFocus={reportValidity}
                    onBlur={updateValidity}
                />
            </div>
        );
    }

    protected generateClassNames(): string {
        const {
            cssBackground,
            cssBackground__disabled,
        }: Partial<CSSBackgroundClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(
            classNames(cssBackground, [cssBackground__disabled, this.props.disabled])
        );
    }

    private handleBackgroundOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            value: e.target.value || void 0,
        });
    };
}
