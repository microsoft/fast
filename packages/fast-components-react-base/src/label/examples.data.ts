import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Label, {
    ILabelHandledProps,
    ILabelMangedClasses,
    ILabelUnhandledProps,
    LabelTag
} from "./label";

const examples: ISnapshotTestSuite<ILabelHandledProps & ILabelMangedClasses> = {
    name: "label",
    component: Label,
    data: [
        {
            managedClasses: {
                label: "label"
            },
            tag: LabelTag.label,
            children: "Label"
        },
        {
            managedClasses: {
                label: "label"
            },
            tag: LabelTag.div,
            children: "div label"
        },
        {
            managedClasses: {
                label: "paragraph label"
            },
            tag: LabelTag.p,
            children: "Label"
        },
        {
            managedClasses: {
                label: "span label"
            },
            tag: LabelTag.span,
            children: "Label"
        },
        {
            managedClasses: {
                label: "legend label"
            },
            tag: LabelTag.legend,
            children: "Legend label"
        }
    ]
};

export default examples;
