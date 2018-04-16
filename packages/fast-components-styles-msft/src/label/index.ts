import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ILabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "../utilities/units";
import { typeRamp } from "../utilities/typography";

const styles: ComponentStyles<ILabelClassNameContract, IDesignSystem> = {
    label: {
        fontSize: toPx(typeRamp.t8.vp3.fontSize),
        display: "inline-block",
        marginTop: toPx(0),
        paddingBottom: toPx(7),
        lineHeight: toPx(20)
    }
};

export default styles;
