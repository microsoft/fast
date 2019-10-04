import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyAddItemStyle,
    applyCleanListStyle,
    applyLabelRegionStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
} from "../../style";

/**
 * Array class name contract
 */
export interface ArrayControlClassNameContract {
    arrayControl?: string;
    arrayControl__disabled?: string;
    arrayControl__invalid?: string;
    arrayControl_addItem?: string;
    arrayControl_addItemButton?: string;
    arrayControl_addItemLabel?: string;
    arrayControl_existingItemList?: string;
    arrayControl_existingItemListItem?: string;
    arrayControl_existingItemListItemLink?: string;
    arrayControl_existingItemListItemLink__default?: string;
    arrayControl_existingItemRemoveButton?: string;
}

const styles: ComponentStyles<ArrayControlClassNameContract, {}> = {
    arrayControl: {
        "&::after": {
            content: "''",
            display: "block",
            width: "calc(100% - 30px)",
            borderBottom: "1px solid transparent",
        },
    },
    arrayControl__disabled: {},
    arrayControl__invalid: {
        "&::after": {
            borderColor: "red",
        },
    },
    arrayControl_addItem: {
        ...applyLabelRegionStyle(),
        position: "relative",
    },
    arrayControl_addItemLabel: {
        ...applyLabelStyle(),
        maxWidth: "calc(100% - 30px)",
    },
    arrayControl_addItemButton: {
        ...applyAddItemStyle(),
    },
    arrayControl_existingItemList: {
        ...applyCleanListStyle(),
        fontSize: "12px",
    },
    arrayControl_existingItemListItem: {
        position: "relative",
        paddingLeft: "10px",
        marginLeft: "-10px",
        cursor: "pointer",
        height: "30px",
        lineHeight: "30px",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
    },
    arrayControl_existingItemListItemLink: {
        ...ellipsis(),
        cursor: "pointer",
        display: "block",
        height: "30px",
        lineHeight: "30px",
        width: "calc(100% - 30px)",
    },
    arrayControl_existingItemListItemLink__default: {
        cursor: "auto",
    },
    arrayControl_existingItemRemoveButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
