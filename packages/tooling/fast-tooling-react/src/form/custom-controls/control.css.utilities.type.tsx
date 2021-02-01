import { Type } from "@microsoft/fast-tooling/dist/css-data.types";
import { renderColorPicker, renderDefault } from "./control.css.utilities";
import { RenderRefControlConfig } from "./control.css.utilities.props";
import React from "react";

/**
 * The type control, for a list of available types refer to:
 * https://github.com/mdn/data/blob/master/css/types.json
 *
 * These are provided from the @microsoft/fast-tooling package
 * as TypeScript type.
 */
export function renderTypeControl(config: RenderRefControlConfig): React.ReactNode {
    // some types omitted as they default to syntax definitions
    switch (config.ref.ref as Type) {
        case "<angle>":
        case "<color>":
        case "<custom-ident>":
        case "<dimension>":
        case "<flex>":
        case "<ident>":
        case "<integer>":
        case "<length>":
        case "<number>":
        case "<percentage>":
        case "<ratio>":
        case "<resolution>":
        case "<string>":
        case "<time>":
        case "<url>":
        default:
            return renderDefault(config);
    }
}
