import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
} from "@microsoft/fast-jss-utilities";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
import { DesignSystem, withDesignSystemDefaults } from "../utilities/design-system";
import { applySelectInputStyles, applySelectSpanStyles } from "../../style/utilities";

const styles: ComponentStyles<
    SelectDeviceClassNameContract,
    {}
> = (config: {}): ComponentStyleSheet<SelectDeviceClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        selectDevice: {
            display: "inline-block",
            verticalAlign: "text-bottom",
        },
        selectDevice_label: {
            lineHeight: "16px",
            fontSize: "14px",
            marginRight: "16px",
            ...ellipsis(),
        },
        selectDevice_contentRegion: {
            ...applySelectSpanStyles(),
        },
        selectDevice_select: {
            ...applySelectInputStyles(),
        },
    };
};

export default styles;
