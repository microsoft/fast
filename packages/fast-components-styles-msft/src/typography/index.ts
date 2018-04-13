import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { ITypographyClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { toPx } from "../utilities/units";

function applyParagraphDefaults(): ICSSRules<IDesignSystem> {
    return {
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        marginTop: toPx(0),
        marginBottom: toPx(0)
    };
}

const styles: ComponentStyles<ITypographyClassNameContract, IDesignSystem> = {
    typography_1: {
        ...applyTypeRampConfig("t1"),
        ...applyParagraphDefaults()
    },
    typography_2: {
        ...applyTypeRampConfig("t2"),
        ...applyParagraphDefaults()
    },
    typography_3: {
        ...applyTypeRampConfig("t3"),
        ...applyParagraphDefaults()
    },
    typography_4: {
        ...applyTypeRampConfig("t4"),
        ...applyParagraphDefaults()
    },
    typography_5: {
        ...applyTypeRampConfig("t5"),
        ...applyParagraphDefaults()
    },
    typography_6: {
        ...applyTypeRampConfig("t6"),
        ...applyParagraphDefaults()
    },
    typography_7: {
        ...applyTypeRampConfig("t7"),
        ...applyParagraphDefaults()
    },
    typography_8: {
        ...applyTypeRampConfig("t8"),
        ...applyParagraphDefaults()
    },
    typography_9: {
        ...applyTypeRampConfig("t9"),
        ...applyParagraphDefaults()
    }
};

export default styles;
