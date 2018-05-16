import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyAriaHiddenStyles,
    applyCleanListStyle,
    applyGlobalStyle,
    applyInputStyle,
    applyListItemStyle,
    applyPopupHeadingStyles,
    applyPopupMenuStyles,
    colors
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemChildrenClassNameContract, {}> = {
    "@global": {
        ...applyGlobalStyle()
    },
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
            background: colors.pink,
            "&:hover": {
                background: colors.lightPink
            },
            "&:focus": {
                outline: "none",
                background: colors.darkPink
            }
        }
    },
    formItemChildren_childOptionsMenu: {
        ...applyCleanListStyle(),
        "& li": {
            padding: `${toPx(4)} 0`,
            "& a": {
                color: colors.pink,
                textDecoration: "underline",
                cursor: "pointer"
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
                background: "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC4zMSAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtpc29sYXRpb246aXNvbGF0ZTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnRyYXNoY2FuVVBEQVRFRDwvdGl0bGU+PGcgY2xhc3M9ImNscy0xIj48cGF0aCBkPSJNMjcuNjMsMTAuMjhIMjYuMDd2MThhMi4zMywyLjMzLDAsMCwxLTIuMzUsMi4zNEgxMS4yMmEyLjM0LDIuMzQsMCwwLDEtMS42Ni0uNjgsMi4zLDIuMywwLDAsMS0uNjgtMS42NnYtMThINy4zMlY4LjcyaDYuMjVWNy4xNmExLjUxLDEuNTEsMCwwLDEsLjEyLS42MSwxLjU2LDEuNTYsMCwwLDEsLjMzLS41LDEuNjcsMS42NywwLDAsMSwuNS0uMzMsMS41NSwxLjU1LDAsMCwxLC42MS0uMTNoNC42OWExLjU1LDEuNTUsMCwwLDEsLjYxLjEzLDEuNjMsMS42MywwLDAsMSwuNDkuMzMsMS43NywxLjc3LDAsMCwxLC4zNC41LDEuNTEsMS41MSwwLDAsMSwuMTIuNjFWOC43Mmg2LjI1Wm0tMy4xMywwSDEwLjQ0djE4YS43Ni43NiwwLDAsMCwuMjMuNTUuNzguNzgsMCwwLDAsLjU1LjIzaDEyLjVhLjc2Ljc2LDAsMCwwLC41NS0uMjMuNzMuNzMsMCwwLDAsLjIzLS41NVpNMTUuMTMsMjUuOTFIMTMuNTdWMTMuNDFoMS41NlptMC0xNy4xOWg0LjY5VjcuMTZIMTUuMTNabTMuMTIsMTcuMTlIMTYuNjlWMTMuNDFoMS41NlptMy4xMywwSDE5LjgyVjEzLjQxaDEuNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNy4zMiAtNS41OSkiLz48L2c+PC9zdmc+) center no-repeat"
            }
        }
    }
};

export default styles;
