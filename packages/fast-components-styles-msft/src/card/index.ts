import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICardClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Direction, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import Chroma from "chroma-js";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<ICardClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<ICardClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;
    const cardShadow: string =
    `${toPx(0)} ${toPx(1.6)} ${toPx(3.6)} ${Chroma(foregroundColor).alpha(0.22).css()},
     ${toPx(0)} ${toPx(0.3)} ${toPx(0.9)} ${Chroma(foregroundColor).alpha(0.18).css()}`;

    return {
        card: {
            width: "100%",
            height: "100%",
            background: backgroundColor,
            boxShadow: cardShadow
        }
    };
};

export default styles;
