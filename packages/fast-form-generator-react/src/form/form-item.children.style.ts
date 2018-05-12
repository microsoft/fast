import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyInputStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemChildrenClassNameContract, {}> = {
    formItemChildren: {
        display: "flex",
        flexDirection: "column"
    },
    formItemChildren_inputWrapper: {
        display: "flex",
        paddingBottom: toPx(12),
        "& input": {
            ...applyInputStyle(),
            flex: "2",
            marginRight: toPx(8)
        },
        "& button": {
            fontSize: toPx(15),
            maxWidth: toPx(374),
            minWidth: toPx(120),
            flex: "1",
            display: "inline-block",
            padding: `${toPx(13)} ${toPx(12)} ${toPx(12)}`,
            border: `${toPx(2)} solid transparent`,
            borderRadius: toPx(2),
            cursor: "pointer",
            overflow: "hidden",
            lineHeight: "1",
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color: colors.white,
            background: colors.blue,
            "&:hover": {
                background: colors.lightBlue
            },
            "&:focus": {
                outline: "none",
                background: colors.darkBlue
            }
        }
    },
    formItemChildren_childOptionsMenu: {
        ...applyCleanListStyle(),
        "& li": {
            padding: `${toPx(4)} 0`,
            "& a": {
                color: colors.blue,
                textDecoration: "underline"
            }
        }
    },
    formItemChildren_existingChildren: {
        ...applyPopupHeadingStyles(),
        "& ul": {
            ...applyAriaHiddenStyles()
        }
    },
    formItemChildren_addedChildren: {
        ...applyCleanListStyle(),
        ...applyListItemStyle(),
    },
    formItemChildren_optionMenu: {
        ...applyCleanListStyle(),
        ...applyPopupMenuStyles()
    },
    formItemChildren_optionMenu__listItem: {
        "& button": {
            "&::before": {
                position: "absolute",
                content: "''",
                opacity: ".6",
                pointerEvents: "none",
                top: toPx(12),
                width: toPx(16),
                height: toPx(16),
                left: toPx(12),
                /* tslint:disable-next-line */
                background: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtpc29sYXRpb246aXNvbGF0ZTtmb250LXNpemU6MjVweDtmb250LWZhbWlseTpNV0ZNREwyQXNzZXRzLCBNV0YgTURMMiBBc3NldHM7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT50cnNzc3NBc3NldCAyPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjx0ZXh0IGNsYXNzPSJjbHMtMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyNSkiPu6djTwvdGV4dD48L2c+PC9nPjwvc3ZnPg==) center no-repeat"
            }
        }
    }
};

export default styles;
