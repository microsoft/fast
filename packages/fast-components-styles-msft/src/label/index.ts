import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ILabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "../utilities/units";
import { applyType } from "../utilities/typography";
import { applyScreenReader } from "../utilities/screen-reader";

const baseStyles: any = {
    ...applyType("t8", "vp3"),
    display: "inline-block",
    marginTop: toPx(0),
    paddingBottom: toPx(7),
};

const styles: ComponentStyles<ILabelClassNameContract, IDesignSystem> = {
    label: {
        baseStyles
    },
    label_hidden: {
        ...applyScreenReader()
    }
};

export default styles;
