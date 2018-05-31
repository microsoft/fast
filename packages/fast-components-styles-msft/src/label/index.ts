import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ILabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyType } from "../utilities/typography";
import { applyScreenReader } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ILabelClassNameContract, IDesignSystem> = {
    label: {
        ...applyType("t8", "vp3"),
        display: "inline-block"
    },
    label_hidden: {
        ...applyScreenReader()
    }
};

export default styles;
