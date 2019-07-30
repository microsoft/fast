import React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CSSBoxShadowHandledProps,
    CSSBoxShadowProps,
    CSSBoxShadowState,
    CSSBoxShadowUnhandledProps,
} from "./box-shadow.props";
import { parseColorHexRGB, ColorRGBA64 } from "@microsoft/fast-colors";

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

    constructor(props: CSSBoxShadowProps) {
        super(props);

        this.state = {
            boxShadowColor: get(this.props.data, "boxShadowColor", ""),
            boxShadowBlurRadius: get(this.props.data, "boxShadowBlurRadius", "4px"),
            boxShadowOffsetX: get(this.props.data, "boxShadowOffsetX", "0"),
            boxShadowOffsetY: get(this.props.data, "boxShadowOffsetY", "4px"),
            boxShadowOpacity: 0.25,
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

            const rgbaValue: string = `rgba(${rgba})`;
            let boxShadowArray: string[] = [
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
                    className={get(
                        this.props,
                        "managedClasses.cssBoxShadow_controlRegion"
                    )}
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
                                style={{ opacity: 0 }}
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
                            max={1}
                            step={0.01}
                            placeholder={"0.5"}
                            value={this.state.boxShadowOpacity}
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
            boxShadowColor: e.target.value,
        });
    };

    private handleBoxShadowOpacityOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            boxShadowOpacity: e.target.valueAsNumber,
        });
    };

    private handleBoxShadowXOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            boxShadowOffsetX: e.target.value,
        });
    };

    private handleBoxShadowYOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            boxShadowOffsetY: e.target.value,
        });
    };

    private handleBoxShadowBlurOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            boxShadowBlurRadius: e.target.value,
        });
    };
}
