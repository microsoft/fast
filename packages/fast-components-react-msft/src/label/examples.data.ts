import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Label from "./index";
import { ILabelHandledProps, LabelTag } from "@microsoft/fast-components-react-base";
import * as React from "react";

export default {
    name: "label",
    component: Label,
    data: [
        {
            tag: LabelTag.label,
            children: "Label"
        },
        {
            tag: LabelTag.div,
            children: "div label"
        },
        {
            tag: LabelTag.p,
            children: "Label"
        },
        {
            tag: LabelTag.span,
            children: "Label"
        },
        {
            tag: LabelTag.legend,
            children: "Legend label"
        }
    ]
} as ISnapshotTestSuite<ILabelHandledProps>;
