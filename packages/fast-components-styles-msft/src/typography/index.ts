import { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { foregroundNormal } from "../utilities/colors";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";

const paragraphDefaults: ICSSRules<IDesignSystem> = {
    color: foregroundNormal,
    marginTop: "0",
    marginBottom: "0"
};

const styles: ComponentStyles<ITypographyClassNameContract, IDesignSystem> = {
    typography_1: {
        ...applyTypeRampConfig("t1"),
        ...paragraphDefaults
    },
    typography_2: {
        ...applyTypeRampConfig("t2"),
        ...paragraphDefaults
    },
    typography_3: {
        ...applyTypeRampConfig("t3"),
        ...paragraphDefaults
    },
    typography_4: {
        ...applyTypeRampConfig("t4"),
        ...paragraphDefaults
    },
    typography_5: {
        ...applyTypeRampConfig("t5"),
        ...paragraphDefaults
    },
    typography_6: {
        ...applyTypeRampConfig("t6"),
        ...paragraphDefaults
    },
    typography_7: {
        ...applyTypeRampConfig("t7"),
        ...paragraphDefaults
    },
    typography_8: {
        ...applyTypeRampConfig("t8"),
        ...paragraphDefaults
    },
    typography_9: {
        ...applyTypeRampConfig("t9"),
        ...paragraphDefaults
    }
};

export default styles;
