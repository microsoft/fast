import React from "react";
import { get } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { CSSHeightHandledProps, CSSHeightUnhandledProps } from "./height.props";

export default class CSSHeight extends Foundation<
    CSSHeightHandledProps,
    CSSHeightUnhandledProps,
    {}
> {
    public static displayName: string = "CSSHeight";

    protected handledProps: HandledProps<CSSHeightHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <div className={get(this.props, "managedClasses.cssHeight")}>
                <div className={get(this.props, "managedClasses.cssHeight_control")}>
                    <label className={get(this.props, "managedClasses.cssHeight_label")}>
                        Height
                    </label>
                    <input
                        className={get(this.props, "managedClasses.cssHeight_input")}
                        type={"text"}
                        value={get(this.props.data, "height")}
                        onChange={this.handleHeightOnChange}
                    />
                </div>
            </div>
        );
    }

    private handleHeightOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange({
            height: e.target.value || void 0,
        });
    };
}
