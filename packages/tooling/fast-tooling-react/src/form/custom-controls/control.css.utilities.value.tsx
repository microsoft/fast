import { renderDefault, renderZeroOrOne } from "./control.css.utilities";
import { RenderRefControlConfig } from "./control.css.utilities.props";
import React from "react";

/**
 * The value control, used for when string values are available
 */
export function renderValueControl(config: RenderRefControlConfig): React.ReactNode {
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
