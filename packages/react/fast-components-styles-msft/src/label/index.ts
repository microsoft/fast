import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { LabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyScreenReader } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { neutralForegroundRest } from "../utilities/color";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<LabelClassNameContract, DesignSystem> = {
    label: {
        ...applyScaledTypeRamp("t7"),
        display: "inline-block",
        color: neutralForegroundRest,
        padding: "0",
    },
    label__hidden: {
        ...applyScreenReader(),
    },
};

export default styles;
