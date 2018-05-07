import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";

export function applyLabelStyle(): ICSSRules<{}> {
    return {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        marginRight: toPx(16),
        ...ellipsis()
    };
}

export function applyInputStyle(): ICSSRules<{}> {
    return {
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: toPx(2),
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
        padding: toPx(8),
        border: "none",
        outline: "none"
    };
}

export function applyWrapperStyle(): ICSSRules<{}> {
    return {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: toPx(8)
    };
}
