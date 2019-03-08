import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { TypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { neutralForegroundRest } from "../utilities/color";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";

const styles: ComponentStyles<TypographyClassNameContract, DesignSystem> = {
    typography: {
        color: neutralForegroundRest,
        marginTop: "0",
        marginBottom: "0",
    },
    typography__1: {
        ...applyTypeRampConfig("t1"),
    },
    typography__2: {
        ...applyTypeRampConfig("t2"),
    },
    typography__3: {
        ...applyTypeRampConfig("t3"),
    },
    typography__4: {
        ...applyTypeRampConfig("t4"),
    },
    typography__5: {
        ...applyTypeRampConfig("t5"),
    },
    typography__6: {
        ...applyTypeRampConfig("t6"),
    },
    typography__7: {
        ...applyTypeRampConfig("t7"),
    },
    typography__8: {
        ...applyTypeRampConfig("t8"),
    },
    typography__9: {
        ...applyTypeRampConfig("t9"),
    },
};

export default styles;
