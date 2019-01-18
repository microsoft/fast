import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    Direction,
    ellipsis,
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import devSiteDesignSystemDefaults, {
    DevSiteDesignSystem,
} from "../components/design-system";

export function applyScrollbarStyle(): CSSRules<{}> {
    return {
        "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
            overflow: "auto",
            float: "left",
            background: (config: DevSiteDesignSystem): string => {
                return config.background300 || devSiteDesignSystemDefaults.background300;
            },
        },
        "&::-webkit-scrollbar-thumb": {
            background: (config: DevSiteDesignSystem): string => {
                return config.background800 || devSiteDesignSystemDefaults.background800;
            },
            borderRadius: "2px",
        },
    };
}
