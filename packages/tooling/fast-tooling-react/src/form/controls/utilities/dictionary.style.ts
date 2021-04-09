import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    addItemStyle,
    controlRegionStyle,
    controlStyle,
    inputStyle,
    labelStyle,
    removeItemStyle,
} from "../../../style";

/**
 * Display class name contract
 */
export interface DictionaryClassNameContract {
    dictionary?: string;
    dictionary_control?: string;
    dictionary_controlRegion?: string;
    dictionary_controlLabel?: string;
    dictionary_controlAddTrigger?: string;
    dictionary_itemControl?: string;
    dictionary_itemControlLabel?: string;
    dictionary_itemControlRegion?: string;
    dictionary_itemControlInput?: string;
    dictionary_itemControlRemoveTrigger?: string;
}

const styles: ComponentStyles<DictionaryClassNameContract, {}> = {
    dictionary: {},
    dictionary_itemControl: {
        ...controlStyle,
        "line-height": "20px",
    },
    dictionary_itemControlLabel: {
        ...labelStyle,
        display: "block",
        "padding-bottom": "10px",
    },
    dictionary_itemControlRegion: {
        ...controlRegionStyle,
    },
    dictionary_itemControlInput: {
        ...inputStyle,
        width: "calc(100% - 4px)",
    },
    dictionary_itemControlRemoveTrigger: {
        ...removeItemStyle,
        bottom: "2px",
        top: "unset",
    },
    dictionary_control: {
        ...controlStyle,
    },
    dictionary_controlRegion: {
        ...controlRegionStyle,
    },
    dictionary_controlAddTrigger: {
        ...addItemStyle,
    },
    dictionary_controlLabel: {
        ...labelStyle,
        width: "100%",
    },
};

export default styles;
