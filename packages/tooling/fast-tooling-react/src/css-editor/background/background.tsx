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

export default class CSSBackground extends Foundation<
    CSSBackgroundHandledProps,
    CSSBackgroundUnhandledProps,
    {}
> {
    public static displayName: string = "CSSBackground";

    protected handledProps: HandledProps<CSSBackgroundHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssBackground")}>
                <label className={get(this.props, "managedClasses.cssBackground_label")}>
                    Background
                </label>
                <div className={get(this.props, "managedClasses.cssBackground_control")}>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.cssBackground_colorInputRegion"
                        )}
                        style={{
                            background: get(this.props.data, "background", ""),
                        }}
                    >
                        <input
                            type={"color"}
                            style={{ opacity: 0, width: "100%" }}
                            onChange={this.handleBackgroundOnChange}
                            value={get(this.props.data, "background", "")}
                        />
                    </div>
                    <input
                        className={get(this.props, "managedClasses.cssBackground_input")}
                        type={"text"}
                        value={get(this.props.data, "background", "")}
                        onChange={this.handleBackgroundOnChange}
                    />
                </div>
            </div>
        );
    }

    private handleBackgroundOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            background: e.target.value || void 0,
        });
    };
}
