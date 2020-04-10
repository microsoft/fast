import React from "react";
import { get, pick } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    BorderProperty,
    BorderStyleValue,
    CSSBorderHandledProps,
    CSSBorderProps,
    CSSBorderUnhandledProps,
    CSSBorderValues,
} from "./border.props";

export default class CSSBorder extends Foundation<
    CSSBorderHandledProps,
    CSSBorderUnhandledProps,
    {}
> {
    public static displayName: string = "CSSBorder";

    protected handledProps: HandledProps<CSSBorderHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    private defaultBorderColor: string = "#000000";

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssBorder")}>
                <label className={get(this.props, "managedClasses.cssBorder_label")}>
                    Border
                </label>
                <div className={get(this.props, "managedClasses.cssBorder_control")}>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.cssBorder_colorInputRegion"
                        )}
                        style={{
                            background: get(
                                this.props.data,
                                "borderColor",
                                this.defaultBorderColor
                            ),
                        }}
                    >
                        <input
                            type={"color"}
                            style={{ opacity: 0, width: "100%" }}
                            value={get(
                                this.props.data,
                                "borderColor",
                                this.defaultBorderColor
                            )}
                            onChange={this.handleInputOnChange(
                                BorderProperty.borderColor
                            )}
                        />
                    </div>
                    <span
                        className={get(
                            this.props,
                            "managedClasses.cssBorder_selectControl"
                        )}
                    >
                        <select
                            className={get(this.props, "managedClasses.cssBorder_select")}
                            onChange={this.handleInputOnChange(
                                BorderProperty.borderStyle
                            )}
                            value={get(this.props.data, "borderStyle", "")}
                        >
                            {[""]
                                .concat(Object.keys(BorderStyleValue))
                                .map(this.renderBorderOption)}
                        </select>
                    </span>
                    <input
                        className={get(this.props, "managedClasses.cssBorder_input")}
                        type={"text"}
                        placeholder={"initial"}
                        value={get(this.props.data, "borderWidth", "")}
                        onChange={this.handleInputOnChange(BorderProperty.borderWidth)}
                    />
                </div>
            </div>
        );
    }

    private renderBorderOption(style: string): JSX.Element {
        return (
            <option key={style} value={style}>
                {style.charAt(0).toUpperCase().concat(style.slice(1))}
            </option>
        );
    }

    private handleInputOnChange(
        cssKey: BorderProperty
    ): (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
            const border: CSSBorderValues = pick(this.props.data, [
                BorderProperty.borderColor,
                BorderProperty.borderStyle,
                BorderProperty.borderWidth,
            ]);

            switch (cssKey) {
                case BorderProperty.borderStyle:
                    border[cssKey] = e.target.value as BorderStyleValue;
                    break;
                default:
                    border[cssKey] = e.target.value;
                    break;
            }

            this.props.onChange(border);
        };
    }
}
