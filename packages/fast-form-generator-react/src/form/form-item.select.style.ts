import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";

function applypaddingStyle(): any {
    return {
        padding: localizeSpacing(Direction.ltr)(`${toPx(8)} ${toPx(24)} ${toPx(8)} ${toPx(8)}`)
    };
}

const styles: any = {
    form_item_select_wrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: toPx(8)
    },
    form_item_select_label: {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        marginRight: toPx(16),
        ...ellipsis()
    },
    form_item_select_span: {
        position: "relative",
        display: "flex",
        flexGrow: "1",
        "&:before, &:after": {
            content: "''",
            position: "absolute",
            top: toPx(12),
            zIndex: 1,
            borderRadius: toPx(2),
            width: toPx(1),
            height: toPx(10),
            background: "black"
        },
        "&:before": {
            right: toPx(15),
            transform: "rotate(45deg)"
        },
        "&:after": {
            right: toPx(22),
            transform: "rotate(-45deg)"
        }
    },
    form_item_select_input: {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: "2px",
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
        appearance: "none",
        ...applypaddingStyle(),
        border: "none",
        outline: "none",
        "&:-ms-expand": {
            display: "none"
        },
        "&:-ms-value": {
            background: "white",
            color: "black"
        }
    },
    form_item_select_option: {
        ...applypaddingStyle()
    }
};

export default styles;
