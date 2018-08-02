import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Label, {
    ILabelHandledProps,
    ILabelManagedClasses,
    ILabelUnhandledProps,
    LabelTag
} from "./label";
import schema from "./label.schema.json";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<ILabelHandledProps & ILabelManagedClasses> = {
    name: "Label",
    component: Label,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            label: "label",
            label_hidden: "hidden_label"
        },
        tag: LabelTag.label,
        children: "Label"
    },
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
