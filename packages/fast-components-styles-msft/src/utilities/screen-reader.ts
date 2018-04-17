import { ICSSRules } from "@microsoft/fast-jss-manager";
import { IDesignSystem } from "../design-system";

export function applyScreenReader(): ICSSRules<IDesignSystem> {
    return {
        position: "absolute !important",
        overflow: "hidden !important",
        clip: "rect(1px, 1px, 1px, 1px) !important",
        width: "1px !important",
        height: "1px !important",
        border: "0 !important",
        padding: "0 !important",
        margin: "0 !important"
    };
}
