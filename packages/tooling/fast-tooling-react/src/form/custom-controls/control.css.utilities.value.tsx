import { renderDefault, renderZeroOrOne } from "./control.css.utilities";
import { RenderControlConfig } from "./control.css.utilities.props";
import React from "react";
import { CSSPropertyRef } from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

export interface RenderValueControlConfig extends RenderControlConfig {
    ref: CSSPropertyRef;
}

/**
 * The value control, used for when string values are available
 */
export function renderValueControl(config: RenderValueControlConfig): React.ReactNode {
    if (config.ref.multiplier) {
        switch (config.ref.multiplier.type) {
            case "zeroOrOne":
                return renderZeroOrOne({
                    ...config,
                });
        }
    }

    return renderDefault(config);
}
