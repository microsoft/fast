import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { CardClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<CardClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CardClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        card: {
            width: "100%",
            height: "100%",
            background: designSystem.backgroundColor,
            borderRadius: toPx(designSystem.cornerRadius),
            ...elevation(ElevationMultiplier.e4, designSystem.foregroundColor)(
                designSystem
            ),
        },
    };
};

export default styles;
