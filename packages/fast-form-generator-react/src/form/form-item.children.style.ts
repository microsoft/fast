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
                background: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPnRyYXNoY2FuVVBEQVRFRDwvdGl0bGU+PGc+PHBhdGggZD0iTTE0LjMsMy4yaC0xdjExLjRjMCwwLjgtMC43LDEuNS0xLjUsMS41YzAsMCwwLDAsMCwwSDRjLTAuNCwwLTAuOC0wLjItMS0wLjRjLTAuMy0wLjMtMC40LTAuNy0wLjQtMVYzLjJoLTF2LTFoMy45di0xYzAtMC4xLDAtMC4zLDAuMS0wLjRjMC0wLjEsMC4xLTAuMiwwLjItMC4zQzUuOCwwLjQsNiwwLjMsNi4xLDAuM2MwLjEtMC4xLDAuMy0wLjEsMC40LTAuMWgzYzAuMSwwLDAuMywwLDAuNCwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuMywwLjJjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjNjMC4xLDAuMSwwLjEsMC4zLDAuMSwwLjR2MWgzLjlMMTQuMywzLjJ6IE0xMi40LDMuMkgzLjV2MTEuNGMwLDAuMSwwLjEsMC4zLDAuMSwwLjNDMy43LDE1LDMuOSwxNSw0LDE1aDcuOWMwLjEsMCwwLjMtMC4xLDAuMy0wLjFjMC4xLTAuMSwwLjEtMC4yLDAuMS0wLjNMMTIuNCwzLjJ6IE02LjUsMTNoLTFWNS4xaDFMNi41LDEzeiBNNi41LDIuMmgzdi0xaC0zVjIuMnogTTguNCwxM2gtMVY1LjFoMVYxM3ogTTEwLjQsMTNoLTFWNS4xaDFMMTAuNCwxM3oiLz48L2c+PC9zdmc+) center no-repeat"
            }
        }
    }
};

export default styles;
