import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Label from "./index";
import { ILabelHandledProps, LabelTag } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/label/label.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Label",
    component: Label,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        tag: LabelTag.label,
        children: "Label"
    },
    data: [
        {
            tag: LabelTag.label,
            children: "Label",
            "data-sketch-symbol": "Label"
        },
        {
            tag: LabelTag.legend,
            children: "Legend label"
        },
        {
            hidden: true,
            tag: LabelTag.label,
            children: "Hidden label"
        }
    ]
} as ISnapshotTestSuite<ILabelHandledProps>;
