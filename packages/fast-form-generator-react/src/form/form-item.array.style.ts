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
            background: "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtpc29sYXRpb246aXNvbGF0ZTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnBsdXNVUERBVEVEPC90aXRsZT48ZyBjbGFzcz0iY2xzLTEiPjxwYXRoIGQ9Ik0zMC43NSwxNy4zMXYxLjU3SDE5VjMwLjU5SDE3LjQ3VjE4Ljg4SDUuNzVWMTcuMzFIMTcuNDdWNS41OUgxOVYxNy4zMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01Ljc1IC01LjU5KSIvPjwvZz48L3N2Zz4=) center no-repeat"
        }
    },
    formItemArray_actionMenuItem__remove: {
        "&::before": {
            /* tslint:disable-next-line */
            background: "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSAxLjU2Ij48ZGVmcz48c3R5bGU+LmNscy0xe2lzb2xhdGlvbjppc29sYXRlO308L3N0eWxlPjwvZGVmcz48dGl0bGU+bWludXNVcGRhdGVkPC90aXRsZT48ZyBjbGFzcz0iY2xzLTEiPjxwYXRoIGQ9Ik0zMC43NSwxOC44OGgtMjVWMTcuMzFoMjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNS43NSAtMTcuMzEpIi8+PC9nPjwvc3ZnPg==) center no-repeat"
        }
    },
    formItemArray_linkMenu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    }
};

export default styles;
