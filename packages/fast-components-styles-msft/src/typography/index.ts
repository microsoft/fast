import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { TypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem } from "../design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import { neutralForegroundRest } from "../utilities/color";

const styles: ComponentStyles<TypographyClassNameContract, DesignSystem> = {
    typography: {
        color: neutralForegroundRest,
        "margin-top": "0",
        "margin-bottom": "0",
        transition: "all 0.2s ease-in-out",
    },
    typography__1: {
        ...applyScaledTypeRamp("t1"),
    },
    typography__2: {
        ...applyScaledTypeRamp("t2"),
    },
    typography__3: {
        ...applyScaledTypeRamp("t3"),
    },
    typography__4: {
        ...applyScaledTypeRamp("t4"),
    },
    typography__5: {
        ...applyScaledTypeRamp("t5"),
    },
    typography__6: {
        ...applyScaledTypeRamp("t6"),
    },
    typography__7: {
        ...applyScaledTypeRamp("t7"),
    },
    typography__8: {
        ...applyScaledTypeRamp("t8"),
    },
    typography__9: {
        ...applyScaledTypeRamp("t9"),
    },
};

export default styles;
