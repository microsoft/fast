import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    addItemStyle,
    controlRegionStyle,
    controlStyle,
    inputStyle,
    labelStyle,
    removeItemStyle,
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
        ...controlStyle,
    },
    formDictionary_itemControlLabel: {
        ...labelStyle,
    },
    formDictionary_itemControlRegion: {
        ...controlRegionStyle,
    },
    formDictionary_itemControlInput: {
        ...inputStyle,
        width: "100%",
    },
    formDictionary_itemControlRemoveTrigger: {
        ...removeItemStyle,
        top: "2px",
    },
    formDictionary_control: {
        ...controlStyle,
    },
    formDictionary_controlRegion: {
        ...controlRegionStyle,
    },
    formDictionary_controlAddTrigger: {
        ...addItemStyle,
    },
    formDictionary_controlLabel: {
        ...labelStyle,
        width: "100%",
    },
};

export default styles;
