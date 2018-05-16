import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyGlobalStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors,
    localizePadding
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemArrayClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle()
    },
    formItemArray: {
        ...applyPopupHeadingStyles(),
        marginTop: toPx(8),
        "& button": {
            lineHeight: "1",
            fontSize: toPx(14),
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: `${toPx(4)}`,
            "&:focus": {
                outline: "none"
            }
        }
    },
    formItemArray_actionMenu: {
        ...applyCleanListStyle(),
        ...applyAriaHiddenStyles(),
        ...applyPopupMenuStyles(),
        "& $formItemArray_actionMenuItem__add, & $formItemArray_actionMenuItem__remove": {
                ...localizePadding(12, 12, 12, 36),
                width: "100%",
                ...ellipsis(),
                textAlign: "left",
                color: colors.black,
                "&::before": {
                    position: "absolute",
                    content: "''",
                    opacity: ".6",
                    pointerEvents: "none",
                    width: toPx(16),
                    height: toPx(16),
                    left: toPx(10)
                },
                "&:hover": {
                    backgroundColor: colors.grayBackground
                }
            }
    },
    formItemArray_actionMenuItem__add: {
        "&::before": {
             /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmb250LXNpemU6MjVweDtmb250LWZhbWlseTpNV0ZNREwyQXNzZXRzLCBNV0YgTURMMiBBc3NldHM7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Bc3NldCAyPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjx0ZXh0IGNsYXNzPSJjbHMtMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyNSkiPu6ckDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==) center no-repeat"
        }
    },
    formItemArray_actionMenuItem__remove: {
        "&::before": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmb250LXNpemU6MjVweDtmb250LWZhbWlseTpNV0ZNREwyQXNzZXRzLCBNV0YgTURMMiBBc3NldHM7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Bc3NldCAxPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjx0ZXh0IGNsYXNzPSJjbHMtMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyNSkiPu6cuDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==) center no-repeat"
        }
    },
    formItemArray_linkMenu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    }
};

export default styles;
