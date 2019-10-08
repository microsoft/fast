import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    accent,
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyInputStyle,
    applyRemoveItemStyle,
    applySoftRemove,
    background100,
    foreground300,
} from "../../style";

/**
 * Children class name contract
 */
export interface ChildrenControlClassNameContract {
    childrenControl?: string;
    childrenControl_existingChildren?: string;
    childrenControl_existingChildrenItem?: string;
    childrenControl_existingChildrenItem__default?: string;
    childrenControl_existingChildrenItemLink?: string;
    childrenControl_existingChildrenItemContent?: string;
    childrenControl_existingChildrenItemName?: string;
    childrenControl_childrenList?: string;
    childrenControl_childrenListControl?: string;
    childrenControl_childrenListInput?: string;
    childrenControl_childrenListItem?: string;
    childrenControl_childrenListTrigger?: string;
    childrenControl_delete?: string;
    childrenControl_deleteButton?: string;
}

const styles: ComponentStyles<ChildrenControlClassNameContract, {}> = {
    childrenControl: {},
    childrenControl_existingChildren: {
        ...applyCleanListStyle(),
    },
    childrenControl_existingChildrenItem: {
        position: "relative",
        height: "30px",
        marginLeft: "-10px",
        paddingLeft: "10px",
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        "&$childrenControl_existingChildrenItem__default": {
            cursor: "auto",
        },
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
    },
    childrenControl_existingChildrenItem__default: {},
    childrenControl_existingChildrenItemLink: {
        width: "calc(100% - 36px)",
        "&$childrenControl_existingChildrenItemName, &$childrenControl_existingChildrenItemContent": {
            ...ellipsis(),
            width: "100%",
            display: "inline-block",
            verticalAlign: "bottom",
        },
    },
    childrenControl_existingChildrenItemName: {
        overflow: "hidden",
        display: "inline-block",
        width: "100%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    childrenControl_existingChildrenItemContent: {},
    childrenControl_childrenList: {
        ...applyCleanListStyle(),
        ...applyAriaHiddenStyles(),
        color: foreground300,
        msOverflowStyle: "none",
        background: background100,
        maxHeight: "200px",
        position: "absolute",
        width: "calc(100% - 30px)",
        right: "0",
        left: "0",
        zIndex: "1",
        overflow: "auto",
        "&::-webkit-scrollbar": {
            width: "0 !important",
        },
    },
    childrenControl_childrenListItem: {
        minHeight: "30px",
        fontSize: "12px",
        lineHeight: "16px",
        display: "flex",
        alignItems: "center",
        padding: "0 5px",
        '&[aria-selected="true"]': {
            background: accent,
        },
    },
    childrenControl_childrenListControl: {
        position: "relative",
        width: "calc(100% - 30px)",
    },
    childrenControl_childrenListInput: {
        ...applyInputStyle(),
        paddingRight: "36px",
        width: "100%",
    },
    childrenControl_childrenListTrigger: {
        position: "absolute",
        right: "0",
        bottom: "0",
        border: "none",
        height: "20px",
        width: "20px",
        outline: "none",
        background: "none",
        "&::before": {
            content: "''",
            position: "absolute",
            top: "9px",
            right: "4px",
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderTop: `3px solid ${foreground300}`,
        },
    },
    childrenControl_delete: {
        ...applySoftRemove(),
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
    },
    childrenControl_deleteButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
