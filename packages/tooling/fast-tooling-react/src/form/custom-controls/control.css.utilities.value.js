import { renderDefault, renderCheckbox } from "./control.css.utilities";
/**
 * The value control, used for when string values are available
 */
export function renderValueControl(config) {
    if (config.ref.multiplier) {
        switch (config.ref.multiplier.type) {
            case "zeroOrOne":
                return renderCheckbox(Object.assign({}, config));
        }
    }
    return renderDefault(config);
}
