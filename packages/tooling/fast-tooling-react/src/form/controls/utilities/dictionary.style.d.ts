import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
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
declare const styles: ComponentStyles<DictionaryClassNameContract, {}>;
export default styles;
