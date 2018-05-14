import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Label, {
    ILabelHandledProps,
    ILabelMangedClasses,
    ILabelUnhandledProps,
    LabelTag
} from "./label";
import * as schema from "./label.schema.json";

const examples: ISnapshotTestSuite<ILabelHandledProps & ILabelMangedClasses> = {
    name: "label",
    component: Label,
    schema: schema as any,
    data: [
        {
            managedClasses: {
                label: "label",
                label_hidden: "hidden_label"
            },
            tag: LabelTag.label,
            children: "Label"
        },
        {
            managedClasses: {
                label: "label",
                label_hidden: "hidden_label"
            },
            tag: LabelTag.legend,
            children: "Legend label"
        },
        {
            managedClasses: {
                label: "label",
                label_hidden: "hidden_label"
            },
            hidden: true,
            tag: LabelTag.label,
            children: "Hidden label for screen readers"
        }
    ]
};

export default examples;
