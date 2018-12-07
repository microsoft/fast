import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { LabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { applyScreenReader } from "@microsoft/fast-jss-utilities";
import typographyPattern from "../patterns/typography";

const styles: ComponentStyles<LabelClassNameContract, DesignSystem> = {
    label: {
        ...applyTypeRampConfig("t7"),
        display: "inline-block",
        ...typographyPattern.rest,
        padding: "0",
    },
    label__hidden: {
        ...applyScreenReader(),
    },
};

export default styles;
