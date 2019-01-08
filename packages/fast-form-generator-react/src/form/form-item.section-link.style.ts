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
        display: "flex",
    },
    formItemSectionLink_anchor: {
        ...ellipsis(),
        width: "calc(100% - 30px)",
        cursor: "pointer",
        display: "block",
        fontSize: "11px",
        height: "30px",
        lineHeight: "30px",
    },
    formItemSectionLink_softRemove: {
        ...applySoftRemove(),
    },
    formItemSectionLink_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
