import designSystemDefaults, { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICardClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<ICardClassNameContract, IDesignSystem> = (
    config: IDesignSystem
): ComponentStyleSheet<ICardClassNameContract, IDesignSystem> => {
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const foregroundColor: string = designSystem.foregroundColor;
    const backgroundColor: string = designSystem.backgroundColor;

    return {
        card: {
            width: "100%",
            height: "100%",
            background: backgroundColor,
            ...elevation(ElevationMultiplier.e4, foregroundColor)(designSystem)
        }
    };
};

export default styles;
