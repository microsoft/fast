import {
    addItemStyle,
    controlRegionStyle,
    controlStyle,
    inputStyle,
    labelStyle,
    removeItemStyle,
} from "../../../style";
const styles = {
    dictionary: {},
    dictionary_itemControl: Object.assign(Object.assign({}, controlStyle), {
        "line-height": "20px",
    }),
    dictionary_itemControlLabel: Object.assign(Object.assign({}, labelStyle), {
        display: "block",
        "padding-bottom": "10px",
    }),
    dictionary_itemControlRegion: Object.assign({}, controlRegionStyle),
    dictionary_itemControlInput: Object.assign(Object.assign({}, inputStyle), {
        width: "calc(100% - 4px)",
    }),
    dictionary_itemControlRemoveTrigger: Object.assign(
        Object.assign({}, removeItemStyle),
        { bottom: "2px", top: "unset" }
    ),
    dictionary_control: Object.assign({}, controlStyle),
    dictionary_controlRegion: Object.assign({}, controlRegionStyle),
    dictionary_controlAddTrigger: Object.assign({}, addItemStyle),
    dictionary_controlLabel: Object.assign(Object.assign({}, labelStyle), {
        width: "100%",
    }),
};
export default styles;
