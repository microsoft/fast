import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    applySoftRemove,
    applySoftRemoveInput,
    rightArrow,
} from "../utilities/form-input.style";
import { FormItemSectionLinkClassNameContract } from "../class-name-contracts";

const styles: ComponentStyles<FormItemSectionLinkClassNameContract, {}> = {
    formItemSectionLink: {
        position: "relative",
    },
    formItemSectionLink_anchor: {
        ...ellipsis(),
        cursor: "pointer",
        display: "block",
        height: "40px",
        lineHeight: "40px",
        paddingRight: "56px",
        "&::after": {
            position: "absolute",
            content: "''",
            opacity: ".6",
            pointerEvents: "none",
            top: "11px",
            width: "16px",
            height: "16px",
            background: rightArrow,
            right: "36px",
        },
    },
    formItemSectionLink_softRemove: {
        ...applySoftRemove(),
        position: "absolute",
        right: "0",
        top: "4px",
    },
    formItemSectionLink_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
