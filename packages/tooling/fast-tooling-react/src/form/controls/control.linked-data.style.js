import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    cleanListStyle,
    removeItemStyle,
    selectInputStyle,
    selectSpanStyle,
    softRemoveStyle,
} from "../../style";
const styles = {
    linkedDataControl: {},
    linkedDataControl_existingLinkedData: Object.assign({}, cleanListStyle),
    linkedDataControl_existingLinkedDataItem: {
        position: "relative",
        height: "30px",
        marginLeft: "-10px",
        paddingLeft: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
    },
    linkedDataControl_existingLinkedDataItemLink: {
        width: "calc(100% - 36px)",
        "&$linkedDataControl_existingLinkedDataItemName, &$linkedDataControl_existingLinkedDataItemContent": Object.assign(
            Object.assign({}, ellipsis()),
            { width: "100%", display: "inline-block", verticalAlign: "bottom" }
        ),
    },
    linkedDataControl_existingLinkedDataItemName: Object.assign(
        Object.assign({}, ellipsis()),
        { display: "inline-block", width: "100%", whiteSpace: "nowrap" }
    ),
    linkedDataControl_existingLinkedDataItemContent: {},
    linkedDataControl_linkedDataListControl: {
        position: "relative",
        width: "100%",
    },
    linkedDataControl_linkedDataListInput: Object.assign(
        Object.assign({}, selectInputStyle),
        {
            "&::-webkit-calendar-picker-indicator": {
                display: "none !important",
            },
        }
    ),
    linkedDataControl_linkedDataListInputRegion: Object.assign({}, selectSpanStyle),
    linkedDataControl_delete: Object.assign(Object.assign({}, softRemoveStyle), {
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
    }),
    linkedDataControl_deleteButton: Object.assign(Object.assign({}, removeItemStyle), {
        cursor: "pointer",
    }),
};
export default styles;
