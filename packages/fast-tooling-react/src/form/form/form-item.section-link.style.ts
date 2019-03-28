import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    applyControlSingleLineWrapper,
    applyFormItemBadge,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemSectionLinkClassNameContract } from "./form-item.section-link.props";

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
    formItemSectionLink_badge: {
        ...applyFormItemBadge(),
    },
    formItemSectionLink_softRemove: {
        ...applySoftRemove(),
    },
    formItemSectionLink_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
