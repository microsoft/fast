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

export default class CSSColor extends Foundation<
    CSSColorHandledProps,
    CSSColorUnhandledProps,
    {}
> {
    public static displayName: string = "CSSColor";

    protected handledProps: HandledProps<CSSColorHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssColor")}>
                <label className={get(this.props, "managedClasses.cssColor_label")}>
                    Color
                </label>
                <div className={get(this.props, "managedClasses.cssColor_control")}>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.cssColor_colorInputRegion"
                        )}
                        style={{
                            background: get(this.props.data, "color", ""),
                        }}
                    >
                        <input
                            type={"color"}
                            style={{ opacity: 0, width: "100%" }}
                            onChange={this.handleColorOnChange}
                            value={get(this.props.data, "color", "")}
                        />
                    </div>
                    <input
                        className={get(this.props, "managedClasses.cssColor_input")}
                        type={"text"}
                        value={get(this.props.data, "color", "")}
                        onChange={this.handleColorOnChange}
                    />
                </div>
            </div>
        );
    }

    private handleColorOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            color: e.target.value || void 0,
        });
    };
}
