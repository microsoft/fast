import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { format } from "../utilities/format";
import { designUnit } from "../utilities/design-system";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = {
    contextMenu: {
        background: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => designSystem.backgroundColor
        ),
        ...applyFloatingCornerRadius(),
        ...elevation(ElevationMultiplier.e11)({} as DesignSystem),
        margin: "0",
        padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
        maxWidth: "368px",
        minWidth: "64px",
        transition: "all 0.2s ease-in-out",
    },
};

export default styles;
