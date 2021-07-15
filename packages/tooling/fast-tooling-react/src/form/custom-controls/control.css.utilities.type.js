import {
    renderColorPicker,
    renderDefault,
    renderInteger,
    renderNumber,
} from "./control.css.utilities";
/**
 * The type control, for a list of available types refer to:
 * https://github.com/mdn/data/blob/master/css/types.json
 *
 * These are provided from the @microsoft/fast-tooling package
 * as TypeScript type.
 */
export function renderTypeControl(config) {
    // some types omitted as they default to syntax definitions
    switch (config.ref.ref) {
        case "<angle>":
        case "<color>":
            return renderColorPicker(config);
        case "<custom-ident>":
        case "<dimension>":
        case "<flex>":
        case "<ident>":
        case "<integer>":
            return renderInteger(config);
        case "<length>":
        case "<number>":
            return renderNumber(config);
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
