import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { applyTypeRampConfig } from "../utilities/typography";

/* tslint:disable-next-line */
const styles: ComponentStyles<IMetatextClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMetatextClassNameContract, IDesignSystem> => {
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        metatext: {
            ...applyTypeRampConfig("t7"),
            color: Chroma.mix(backgroundColor, foregroundColor, 0.6).css()
        }
    };
};

export default styles;
