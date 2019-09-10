import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import {
    applyControl,
    applyControlRegion,
    applyControlSingleLineWrapper,
    applyFormControlIndicator,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { SectionLinkFormControlClassNameContract } from "./control.section-link.props";

const styles: ComponentStyles<SectionLinkFormControlClassNameContract, {}> = {
    sectionLinkFormControl: {
        ...applyControlSingleLineWrapper(),
        display: "block",
    },
    sectionLinkFormControl_anchor: {
        ...ellipsis(),
        width: "calc(100% - 30px)",
        cursor: "pointer",
        fontSize: "12px",
        lineHeight: "23px",
        borderBottom: "1px solid transparent",
    },
    sectionLinkFormControl_anchor__invalid: {
        borderColor: "red",
    },
    sectionLinkFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    sectionLinkFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    sectionLinkFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    sectionLinkFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
    sectionLinkFormControl_softRemove: {
        ...applySoftRemove(),
    },
    sectionLinkFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
