import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyControl,
    applyControlRegion,
    applyInputStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
} from "../../style";
import { DictionaryFormControlClassNameContract } from "./control.dictionary.props";

const styles: ComponentStyles<DictionaryFormControlClassNameContract, {}> = {
    dictionaryFormControl: {},
    dictionaryFormControl_itemControl: {
        ...applyControl(),
    },
    dictionaryFormControl_itemControlLabel: {
        ...applyLabelStyle(),
    },
    dictionaryFormControl_itemControlRegion: {
        ...applyControlRegion(),
    },
    dictionaryFormControl_itemControlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    dictionaryFormControl_itemControlRemoveTrigger: {
        ...applyRemoveItemStyle(),
        top: "2px",
    },
    dictionaryFormControl_control: {
        ...applyControl(),
    },
    dictionaryFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    dictionaryFormControl_controlAddTrigger: {
        ...applyAddItemStyle(),
    },
    dictionaryFormControl_controlLabel: {
        ...applyLabelStyle(),
        width: "100%",
    },
};

export default styles;
