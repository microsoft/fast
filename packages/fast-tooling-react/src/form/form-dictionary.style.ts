import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyControl,
    applyControlRegion,
    applyInputStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
} from "../style";

/**
 * Display class name contract
 */
export interface FormDictionaryClassNameContract {
    formDictionary?: string;
    formDictionary_control?: string;
    formDictionary_controlRegion?: string;
    formDictionary_controlLabel?: string;
    formDictionary_controlAddTrigger?: string;
    formDictionary_itemControl?: string;
    formDictionary_itemControlLabel?: string;
    formDictionary_itemControlRegion?: string;
    formDictionary_itemControlInput?: string;
    formDictionary_itemControlRemoveTrigger?: string;
}

const styles: ComponentStyles<FormDictionaryClassNameContract, {}> = {
    formDictionary: {},
    formDictionary_itemControl: {
        ...applyControl(),
    },
    formDictionary_itemControlLabel: {
        ...applyLabelStyle(),
    },
    formDictionary_itemControlRegion: {
        ...applyControlRegion(),
    },
    formDictionary_itemControlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    formDictionary_itemControlRemoveTrigger: {
        ...applyRemoveItemStyle(),
        top: "2px",
    },
    formDictionary_control: {
        ...applyControl(),
    },
    formDictionary_controlRegion: {
        ...applyControlRegion(),
    },
    formDictionary_controlAddTrigger: {
        ...applyAddItemStyle(),
    },
    formDictionary_controlLabel: {
        ...applyLabelStyle(),
        width: "100%",
    },
};

export default styles;
