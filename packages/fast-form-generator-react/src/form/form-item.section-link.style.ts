import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    applyControlSingleLineWrapper,
    applySoftRemove,
    applySoftRemoveInput,
} from "./form.utilities.style";
import { FormItemSectionLinkClassNameContract } from "../class-name-contracts";

const styles: ComponentStyles<FormItemSectionLinkClassNameContract, {}> = {
    formItemSectionLink: {
        ...applyControlSingleLineWrapper(),
    },
    formItemSectionLink_anchor: {
        ...ellipsis(),
        width: "calc(100% - 30px)",
        cursor: "pointer",
        fontSize: "12px",
        lineHeight: "16px",
    },
    formItemSectionLink_softRemove: {
        ...applySoftRemove(),
    },
    formItemSectionLink_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
