import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    cleanListStyle,
    removeItemStyle,
    selectInputStyle,
    selectSpanStyle,
    softRemoveStyle,
} from "../../style";

/**
 * LinkedData class name contract
 */
export interface LinkedDataControlClassNameContract {
    linkedDataControl?: string;
    linkedDataControl_existingLinkedData?: string;
    linkedDataControl_existingLinkedDataItem?: string;
    linkedDataControl_existingLinkedDataItemLink?: string;
    linkedDataControl_existingLinkedDataItemContent?: string;
    linkedDataControl_existingLinkedDataItemName?: string;
    linkedDataControl_linkedDataListControl?: string;
    linkedDataControl_linkedDataListInput?: string;
    linkedDataControl_linkedDataListInputRegion?: string;
    linkedDataControl_delete?: string;
    linkedDataControl_deleteButton?: string;
}

const styles: ComponentStyles<LinkedDataControlClassNameContract, {}> = {
    linkedDataControl: {},
    linkedDataControl_existingLinkedData: {
        ...cleanListStyle,
    },
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
        "&$linkedDataControl_existingLinkedDataItemName, &$linkedDataControl_existingLinkedDataItemContent": {
            ...ellipsis(),
            width: "100%",
            display: "inline-block",
            verticalAlign: "bottom",
        },
    },
    linkedDataControl_existingLinkedDataItemName: {
        ...ellipsis(),
        display: "inline-block",
        width: "100%",
        whiteSpace: "nowrap",
    },
    linkedDataControl_existingLinkedDataItemContent: {},
    linkedDataControl_linkedDataListControl: {
        position: "relative",
        width: "100%",
    },
    linkedDataControl_linkedDataListInput: {
        ...selectInputStyle,
        "&::-webkit-calendar-picker-indicator": {
            display: "none",
        },
    },
    linkedDataControl_linkedDataListInputRegion: {
        ...selectSpanStyle,
    },
    linkedDataControl_delete: {
        ...softRemoveStyle,
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
    },
    linkedDataControl_deleteButton: {
        ...removeItemStyle,
        cursor: "pointer",
    },
};

export default styles;
