import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSBoxShadowHandledProps,
    CSSBoxShadowProps,
    CSSBoxShadowState,
    CSSBoxShadowUnhandledProps,
} from "./box-shadow.props";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";

export default class CSSBoxShadow extends Foundation<
    CSSBoxShadowHandledProps,
    CSSBoxShadowUnhandledProps,
    CSSBoxShadowState
> {
    public static displayName: string = "CSSBoxShadow";

    protected handledProps: HandledProps<CSSBoxShadowHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
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
                boxShadow: boxShadowArray.reduce(
                    (accum: string, current: string): string => {
                        return current.length ? accum.concat(" ", current.trim()) : accum;
                    }
                ),
            });
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssBoxShadow")}>
                <div
                    className={get(this.props, "managedClasses.cssBoxShadow_colorRegion")}
                >
                    <label
                        className={get(this.props, "managedClasses.cssBoxShadow_label")}
                    >
                        Shadow
                    </label>
                    <div
                        className={get(this.props, "managedClasses.cssBoxShadow_control")}
                    >
                        <div
                            className={get(
                                this.props,
                                "managedClasses.cssBoxShadow_colorInputRegion"
                            )}
                            style={{ background: this.state.boxShadowColor }}
                        >
                            <input
                                type={"color"}
                                style={{ opacity: 0, width: "100%" }}
                                value={this.state.boxShadowColor}
                                onChange={this.handleBoxShadowColorOnChange}
                            />
                        </div>
                        <input
                            className={get(
                                this.props,
                                "managedClasses.cssBoxShadow_opacityInput"
                            )}
                            type={"number"}
                            min={0}
                            max={100}
                            step={1}
                            placeholder={"50"}
                            value={Math.round(this.state.boxShadowOpacity * 100)}
                            onChange={this.handleBoxShadowOpacityOnChange}
                        />
                    </div>
                </div>
                <div
                    className={get(
                        this.props,
                        "managedClasses.cssBoxShadow_controlRegion"
                    )}
                >
                    <label
                        className={get(this.props, "managedClasses.cssBoxShadow_label")}
                    >
                        X
                    </label>
                    <input
                        className={get(this.props, "managedClasses.cssBoxShadow_xInput")}
                        type={"text"}
                        placeholder={"5px"}
                        value={this.state.boxShadowOffsetX}
                        onChange={this.handleBoxShadowXOnChange}
                    />
                </div>
                <div
                    className={get(
                        this.props,
                        "managedClasses.cssBoxShadow_controlRegion"
                    )}
                >
                    <label
                        className={get(this.props, "managedClasses.cssBoxShadow_label")}
                    >
                        Y
                    </label>
                    <input
                        className={get(this.props, "managedClasses.cssBoxShadow_yInput")}
                        type={"text"}
                        placeholder={"5px"}
                        value={this.state.boxShadowOffsetY}
                        onChange={this.handleBoxShadowYOnChange}
                    />
                </div>
                <div
                    className={get(
                        this.props,
                        "managedClasses.cssBoxShadow_controlRegion"
                    )}
                >
                    <label
                        className={get(this.props, "managedClasses.cssBoxShadow_label")}
                    >
                        Blur
                    </label>
                    <input
                        className={get(
                            this.props,
                            "managedClasses.cssBoxShadow_blurInput"
                        )}
                        type={"text"}
                        placeholder={"0"}
                        value={this.state.boxShadowBlurRadius}
                        onChange={this.handleBoxShadowBlurOnChange}
                    />
                </div>
            </div>
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
