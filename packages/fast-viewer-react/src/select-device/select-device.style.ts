import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    ellipsis,
    Direction,
} from "@microsoft/fast-jss-utilities";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";
import { DesignSystem, withDesignSystemDefaults } from "../utilities/design-system";

const styles: ComponentStyles<
    SelectDeviceClassNameContract,
    {}
> = (config: {}): ComponentStyleSheet<SelectDeviceClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        selectDevice: {
            display: "inline-block",
        },
        selectDevice_label: {
            lineHeight: "16px",
            fontSize: "14px",
            marginRight: "16px",
            ...ellipsis(),
        },
        selectDevice_contentRegion: {
            position: "relative",
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                top: "4px",
                zIndex: "1",
                borderRadius: "2px",
                width: "1px",
                height: "10px",
                background: "#000000",
            },
            "&::before": {
                [applyLocalizedProperty("right", "left", direction)]: "15px",
                transform:
                    direction === Direction.ltr ? "rotate(45deg)" : "rotate(-45deg)",
            },
            "&::after": {
                [applyLocalizedProperty("right", "left", direction)]: "22px",
                transform:
                    direction === Direction.ltr ? "rotate(-45deg)" : "rotate(45deg)",
            },
        },
        selectDevice_contentRegion_select: {
            border: "none",
            padding: "10px",
            [applyLocalizedProperty("paddingRight", "paddingLeft", direction)]: "36px",
            verticalAlign: "middle",
            outline: "none",
            fontSize: "14px",
            boxShadow: "inset 0px 0px 4px 0px rgba(0, 0, 0, 0.08)",
            lineHeight: "16px",
            borderRadius: "2px",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            appearance: "none",
            "&:-ms-expand": {
                display: "none",
            },
            "&:hover": {
                boxShadow: "inset 0px 0px 2px 0px rgba(0,0,0, .3)",
            },
        },
    };
};

export default styles;
