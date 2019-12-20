import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSBoxShadowHandledProps,
    CSSBoxShadowProps,
    CSSBoxShadowState,
    CSSBoxShadowUnhandledProps,
} from "./box-shadow.props";
import { CSSBoxShadowClassNameContract } from "./box-shadow.style";
import { classNames } from "@microsoft/fast-web-utilities";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";

export default class CSSBoxShadow extends Foundation<
    CSSBoxShadowHandledProps,
    CSSBoxShadowUnhandledProps,
    CSSBoxShadowState
> {
    public static displayName: string = "CSSBoxShadow";

    public static defaultProps: Partial<CSSBoxShadowProps> = {
        value: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<CSSBoxShadowHandledProps> = {
        onChange: void 0,
        managedClasses: void 0,
        dataLocation: void 0,
        value: void 0,
        disabled: void 0,
        elementRef: void 0,
        reportValidity: void 0,
        updateValidity: void 0,
    };

    private defaultBoxShadowColor: string = "#000";
    private defaultBoxShadowBlurRadius: string = "4px";
    private defaultBoxShadowOffsetX: string = "0";
    private defaultBoxShadowOffsetY: string = "4px";
    private defaultBoxShadowOpacity: number = 0.25;

    constructor(props: CSSBoxShadowProps) {
        super(props);

        this.state = {
            boxShadowColor: this.defaultBoxShadowColor,
            boxShadowBlurRadius: this.defaultBoxShadowBlurRadius,
            boxShadowOffsetX: this.defaultBoxShadowOffsetX,
            boxShadowOffsetY: this.defaultBoxShadowOffsetY,
            boxShadowOpacity: this.defaultBoxShadowOpacity,
        };
    }

    public componentDidUpdate(
        prevProps: CSSBoxShadowProps,
        prevState: CSSBoxShadowState
    ): void {
        if (this.state !== prevState) {
            const rgb: ColorRGBA64 = parseColorHexRGB(this.state.boxShadowColor);
            const rgba: ColorRGBA64 = ColorRGBA64.fromObject({
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                a: this.state.boxShadowOpacity,
            });

            const boxShadowArray: string[] = [
                this.state.boxShadowOffsetX,
                this.state.boxShadowOffsetY,
                this.state.boxShadowBlurRadius,
                rgba.toStringWebRGBA(),
            ];

            this.props.onChange({
                value: boxShadowArray.reduce(
                    (accum: string, current: string): string => {
                        return current.length ? accum.concat(" ", current.trim()) : accum;
                    }
                ),
            });
        }
    }

    public render(): React.ReactNode {
        const {
            cssBoxShadow_control,
            cssBoxShadow_colorInputRegion,
            cssBoxShadow_opacityInput,
            cssBoxShadow_controlRegion,
            cssBoxShadow_label,
            cssBoxShadow_xInput,
            cssBoxShadow_yInput,
            cssBoxShadow_blurInput,
        }: Partial<CSSBoxShadowClassNameContract> = this.props.managedClasses;

        return (
            <div className={this.generateClassNames()}>
                <div className={cssBoxShadow_control}>
                    <div
                        className={cssBoxShadow_colorInputRegion}
                        style={{ background: this.state.boxShadowColor }}
                    >
                        <input
                            type={"color"}
                            style={{ opacity: 0, width: "100%" }}
                            value={this.state.boxShadowColor}
                            onChange={this.handleBoxShadowColorOnChange}
                            disabled={this.props.disabled}
                            onFocus={this.props.reportValidity}
                            onBlur={this.props.updateValidity}
                            ref={this.props.elementRef as React.Ref<HTMLInputElement>}
                        />
                    </div>
                    <input
                        className={cssBoxShadow_opacityInput}
                        type={"number"}
                        min={0}
                        max={100}
                        step={1}
                        placeholder={"50"}
                        value={Math.round(this.state.boxShadowOpacity * 100)}
                        onChange={this.handleBoxShadowOpacityOnChange}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className={cssBoxShadow_controlRegion}>
                    <label className={cssBoxShadow_label}>X</label>
                    <input
                        className={cssBoxShadow_xInput}
                        type={"text"}
                        placeholder={"5px"}
                        value={this.state.boxShadowOffsetX}
                        onChange={this.handleBoxShadowXOnChange}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className={cssBoxShadow_controlRegion}>
                    <label className={cssBoxShadow_label}>Y</label>
                    <input
                        className={cssBoxShadow_yInput}
                        type={"text"}
                        placeholder={"5px"}
                        value={this.state.boxShadowOffsetY}
                        onChange={this.handleBoxShadowYOnChange}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className={cssBoxShadow_controlRegion}>
                    <label className={cssBoxShadow_label}>Blur</label>
                    <input
                        className={cssBoxShadow_blurInput}
                        type={"text"}
                        placeholder={"0"}
                        value={this.state.boxShadowBlurRadius}
                        onChange={this.handleBoxShadowBlurOnChange}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }

    protected generateClassNames(): string {
        const {
            cssBoxShadow,
            cssBoxShadow__disabled,
        }: Partial<CSSBoxShadowClassNameContract> = this.props.managedClasses;

        return super.generateClassNames(
            classNames(cssBoxShadow, [cssBoxShadow__disabled, this.props.disabled])
        );
    }

    private handleBoxShadowColorOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            boxShadowColor: e.target.value || this.defaultBoxShadowColor,
        });
    };

    private handleBoxShadowOpacityOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            boxShadowOpacity:
                e.target.valueAsNumber / 100 || this.defaultBoxShadowOpacity,
        });
    };

    private handleBoxShadowXOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            boxShadowOffsetX: e.target.value || this.defaultBoxShadowOffsetX,
        });
    };

    private handleBoxShadowYOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            boxShadowOffsetY: e.target.value || this.defaultBoxShadowOffsetY,
        });
    };

    private handleBoxShadowBlurOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            boxShadowBlurRadius: e.target.value || this.defaultBoxShadowBlurRadius,
        });
    };
}
