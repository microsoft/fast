import React from "react";
import { get } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { CSSWidthHandledProps, CSSWidthUnhandledProps } from "./width.props";

export default class CSSWidth extends Foundation<
    CSSWidthHandledProps,
    CSSWidthUnhandledProps,
    {}
> {
    public static displayName: string = "CSSWidth";

    protected handledProps: HandledProps<CSSWidthHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssWidth")}>
                <div className={get(this.props, "managedClasses.cssWidth_control")}>
                    <label className={get(this.props, "managedClasses.cssWidth_label")}>
                        Width
                    </label>
                    <input
                        className={get(this.props, "managedClasses.cssWidth_input")}
                        type={"text"}
                        value={get(this.props.data, "width")}
                        onChange={this.handleWidthOnChange}
                    />
                </div>
            </div>
        );
    }

    private handleWidthOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            width: e.target.value || void 0,
        });
    };
}
