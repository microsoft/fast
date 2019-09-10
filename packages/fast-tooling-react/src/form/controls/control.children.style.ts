import { ellipsis } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    accent,
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyControl,
    applyControlWrapper,
    applyFormControlIndicator,
    applyGlobalStyle,
    applyInputStyle,
    applyInteractiveFormControlIndicator,
    applyLabelRegionStyle,
    applyLabelStyle,
    applyRemoveItemStyle,
    applySoftRemove,
    background100,
    foreground300,
} from "../../style";
import { ChildrenFormControlClassNameContract } from "./control.children.props";

const styles: ComponentStyles<ChildrenFormControlClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle(),
    },
    childrenFormControl: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...applyControlWrapper(),
    },
    childrenFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    childrenFormControl_control: {
        ...applyControl(),
        verticalAlign: "middle",
    },
    childrenFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    childrenFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    childrenFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    childrenFormControl_existingChildren: {
        ...applyCleanListStyle(),
    },
    childrenFormControl_existingChildrenItem__sorting: {
        fontSize: "12px",
        color: foreground300,
        cursor: "pointer",
    },
    childrenFormControl_existingChildrenItem: {
        position: "relative",
        height: "30px",
        marginLeft: "-10px",
        paddingLeft: "10px",
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        "&$childrenFormControl_existingChildrenItem__sorting": {
            backgroundColor: background100,
        },
        "&$childrenFormControl_existingChildrenItem__default": {
            cursor: "auto",
        },
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
    },
    childrenFormControl_existingChildrenItem__default: {},
    childrenFormControl_existingChildrenItemLink: {
        width: "calc(100% - 36px)",
        "&$childrenFormControl_existingChildrenItemName, &$childrenFormControl_existingChildrenItemContent": {
            ...ellipsis(),
            width: "100%",
            display: "inline-block",
            verticalAlign: "bottom",
        },
    },
    childrenFormControl_existingChildrenItemName: {
        overflow: "hidden",
        display: "inline-block",
        width: "100%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    childrenFormControl_existingChildrenItemContent: {},
    childrenFormControl_childrenList: {
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
    childrenFormControl_childrenListItem: {
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
    childrenFormControl_childrenListControl: {
        position: "relative",
        width: "calc(100% - 30px)",
    },
    childrenFormControl_childrenListInput: {
        ...applyInputStyle(),
        paddingRight: "36px",
        width: "100%",
    },
    childrenFormControl_childrenListTrigger: {
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
    childrenFormControl_delete: {
        ...applySoftRemove(),
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
    },
    childrenFormControl_deleteButton: {
        ...applyRemoveItemStyle(),
        cursor: "pointer",
    },
};

export default styles;
