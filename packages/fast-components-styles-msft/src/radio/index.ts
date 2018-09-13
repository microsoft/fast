import { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import Chroma from "chroma-js";

const styles: ComponentStyles<IRadioClassNameContract, IDesignSystem> = {
    radio: {},
    radio_disabled: {},
    radio_input: {},
    radio_label: {},
    radio_stateIndicator: {}
};

export default styles;
