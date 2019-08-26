import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyControl,
    applyControlRegion,
    applyInputStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
} from "../../style";
import { FormItemDictionaryClassNameContract } from "./form-item.dictionary.props";

const styles: ComponentStyles<FormItemDictionaryClassNameContract, {}> = {
    formItemDictionary: {},
    formItemDictionary_itemControl: {
        ...applyControl(),
    },
    formItemDictionary_itemControlLabel: {
        ...applyLabelStyle(),
    },
    formItemDictionary_itemControlRegion: {
        ...applyControlRegion(),
    },
    formItemDictionary_itemControlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    formItemDictionary_itemControlRemoveTrigger: {
        ...applyRemoveItemStyle(),
        top: "2px",
    },
    formItemDictionary_control: {
        ...applyControl(),
    },
    formItemDictionary_controlRegion: {
        ...applyControlRegion(),
    },
    formItemDictionary_controlAddTrigger: {
        ...applyAddItemStyle(),
    },
    formItemDictionary_controlLabel: {
        ...applyLabelStyle(),
        width: "100%",
    },
};

export default styles;
