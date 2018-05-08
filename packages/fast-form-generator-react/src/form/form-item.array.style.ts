import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IFormItemArrayClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemArrayClassNameContract, {}> = {
    formItemArray: {
        display: "flex",
        flexDirection: "column",
        "& label": {
            lineHeight: toPx(16),
            fontSize: toPx(14),
            flexGrow: "1"
        },
        "& button": {
            lineHeight: "1",
            fontSize: toPx(14),
            cursor: "pointer",
            display: "inline-block",
            background: "transparent",
            border: "none",
            padding: `${toPx(4)}`,
            color: "#0078D7",
            "&:focus": {
                outline: "none"
            }
        },
        "& ul": {
            listStyle: "none",
            margin: "0",
            padding: "0",
            "& > li": {
                flex: "1 100%",
                padding: "12px 48px",
                borderBottom: "1px solid rgba(0,0,0,.2)",
                alignItems: "center",
                "&:before": {
                    /* tslint:disable-next-line */
                    background: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjE7Ij48cGF0aCBkPSJNIDAgMUwgMTYgMUwgMTYgMkwgMCAyTCAwIDFaTSAyIDRMIDE0IDRMIDE0IDVMIDIgNUwgMiA0Wk0gMiAxMEwgMTQgMTBMIDE0IDExTCAyIDExTCAyIDEwWk0gMCAxNEwgMCAxM0wgMTYgMTNMIDE2IDE0TCAwIDE0Wk0gMCA4TCAwIDdMIDE2IDdMIDE2IDhMIDAgOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEpIiBmaWxsPSJ3aGl0ZSIvPjwvZz48L2c+PC9zdmc+) center no-repeat",
                    backgroundColor: "#FB356D",
                    cursor: "pointer",
                    fontSize: "15px",
                    left: "24px",
                    opacity: ".6",
                    pointerVvents: "none",
                    position: "absolute",
                    top: "14px",
                    transform: "scaleX(.8)"
                }
            }
        }
    }
};

export default styles;
