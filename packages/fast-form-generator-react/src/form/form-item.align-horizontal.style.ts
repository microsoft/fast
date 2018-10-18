import {
    applyInputBackplateStyle,
    applyInputContainerStyle,
    applyLabelStyle,
    applyWrapperStyle,
    colors
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemAlignHorizontalClassNameContract } from "../class-name-contracts/";

/* tslint:disable */
const leftDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjI7Ij48cGF0aCBkPSJNIDE2IDFMIDE2IDJMIDAgMkwgMCAxTCAxNiAxWk0gMTYgMTRMIDAgMTRMIDAgMTNMIDE2IDEzTCAxNiAxNFpNIDE2IDhMIDAgOEwgMCA3TCAxNiA3TCAxNiA4Wk0gMTIgNUwgMCA1TCAwIDRMIDEyIDRMIDEyIDVaTSAxMiAxMUwgMCAxMUwgMCAxMEwgMTIgMTBMIDEyIDExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMSkiIGZpbGw9ImJsYWNrIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
const leftLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjI7Ij48cGF0aCBkPSJNIDE2IDFMIDE2IDJMIDAgMkwgMCAxTCAxNiAxWk0gMTYgMTRMIDAgMTRMIDAgMTNMIDE2IDEzTCAxNiAxNFpNIDE2IDhMIDAgOEwgMCA3TCAxNiA3TCAxNiA4Wk0gMTIgNUwgMCA1TCAwIDRMIDEyIDRMIDEyIDVaTSAxMiAxMUwgMCAxMUwgMCAxMEwgMTIgMTBMIDEyIDExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMSkiIGZpbGw9IndoaXRlIi8+PC9nPjwvZz48L3N2Zz4=) center no-repeat";
const centerDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjE7Ij48cGF0aCBkPSJNIDAgMUwgMTYgMUwgMTYgMkwgMCAyTCAwIDFaTSAyIDRMIDE0IDRMIDE0IDVMIDIgNUwgMiA0Wk0gMiAxMEwgMTQgMTBMIDE0IDExTCAyIDExTCAyIDEwWk0gMCAxNEwgMCAxM0wgMTYgMTNMIDE2IDE0TCAwIDE0Wk0gMCA4TCAwIDdMIDE2IDdMIDE2IDhMIDAgOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
const centerLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjE7Ij48cGF0aCBkPSJNIDAgMUwgMTYgMUwgMTYgMkwgMCAyTCAwIDFaTSAyIDRMIDE0IDRMIDE0IDVMIDIgNUwgMiA0Wk0gMiAxMEwgMTQgMTBMIDE0IDExTCAyIDExTCAyIDEwWk0gMCAxNEwgMCAxM0wgMTYgMTNMIDE2IDE0TCAwIDE0Wk0gMCA4TCAwIDdMIDE2IDdMIDE2IDhMIDAgOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEpIiBmaWxsPSJ3aGl0ZSIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
const rightDark: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjA7Ij48cGF0aCBkPSJNIDAgMUwgMTYgMUwgMTYgMkwgMCAyTCAwIDFaTSAwIDE0TCAwIDEzTCAxNiAxM0wgMTYgMTRMIDAgMTRaTSAwIDhMIDAgN0wgMTYgN0wgMTYgOEwgMCA4Wk0gNCA1TCA0IDRMIDE2IDRMIDE2IDVMIDQgNVpNIDQgMTFMIDQgMTBMIDE2IDEwTCAxNiAxMUwgNCAxMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEpIiBmaWxsPSJibGFjayIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
const rightLight: string =
    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNiAxMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iQ2FudmFzIiBmaWxsPSJub25lIj48ZyBpZD0iJiMyMzg7JiMxMzQ7JiMxNjA7Ij48cGF0aCBkPSJNIDAgMUwgMTYgMUwgMTYgMkwgMCAyTCAwIDFaTSAwIDE0TCAwIDEzTCAxNiAxM0wgMTYgMTRMIDAgMTRaTSAwIDhMIDAgN0wgMTYgN0wgMTYgOEwgMCA4Wk0gNCA1TCA0IDRMIDE2IDRMIDE2IDVMIDQgNVpNIDQgMTFMIDQgMTBMIDE2IDEwTCAxNiAxMUwgNCAxMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEpIiBmaWxsPSJ3aGl0ZSIvPjwvZz48L2c+PC9zdmc+) center no-repeat";
/* tslint:enable */

const styles: ComponentStyles<FormItemAlignHorizontalClassNameContract, {}> = {
    formItemAlignHorizontal: {
        ...applyWrapperStyle()
    },
    formItemAlignHorizontal_label: {
        ...applyLabelStyle()
    },
    formItemAlignHorizontal_inputContainer: {
        ...applyInputContainerStyle()
    },
    formItemAlignHorizontal_input__left: {
        ...applyInputBackplateStyle(),
        background: leftDark,
        "&:checked": {
            background: leftLight,
            backgroundColor: colors.pink
        }
    },
    formItemAlignHorizontal_input__center: {
        ...applyInputBackplateStyle(),
        background: centerDark,
        "&:checked": {
            background: centerLight,
            backgroundColor: colors.pink
        }
    },
    formItemAlignHorizontal_input__right: {
        ...applyInputBackplateStyle(),
        background: rightDark,
        "&:checked": {
            background: rightLight,
            backgroundColor: colors.pink
        }
    }
};

export default styles;
