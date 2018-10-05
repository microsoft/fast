import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { TypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { ensureForegroundNormal } from "../utilities/colors";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";

const paragraphDefaults: CSSRules<DesignSystem> = {
    color: ensureForegroundNormal,
    marginTop: "0",
    marginBottom: "0"
};

const styles: ComponentStyles<TypographyClassNameContract, DesignSystem> = {
    typography: {},
    typography__1: {
        ...applyTypeRampConfig("t1"),
        ...paragraphDefaults
    },
    typography__2: {
        ...applyTypeRampConfig("t2"),
        ...paragraphDefaults
    },
    typography__3: {
        ...applyTypeRampConfig("t3"),
        ...paragraphDefaults
    },
    typography__4: {
        ...applyTypeRampConfig("t4"),
        ...paragraphDefaults
    },
    typography__5: {
        ...applyTypeRampConfig("t5"),
        ...paragraphDefaults
    },
    typography__6: {
        ...applyTypeRampConfig("t6"),
        ...paragraphDefaults
    },
    typography__7: {
        ...applyTypeRampConfig("t7"),
        ...paragraphDefaults
    },
    typography__8: {
        ...applyTypeRampConfig("t8"),
        ...paragraphDefaults
    },
    typography__9: {
        ...applyTypeRampConfig("t9"),
        ...paragraphDefaults
    }
};

export default styles;
