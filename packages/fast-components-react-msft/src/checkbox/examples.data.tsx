import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Checkbox from "./index";
import { ICheckboxHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/checkbox/checkbox.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "checkbox",
    component: Checkbox,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        text: "Checkbox"
    },
    data: [
        {
            text: "Default",
            "data-sketch-symbol": "Unchecked checkbox"
        },
        {
            tag: "div",
            text: "div tag"
        },
        {
            checked: true,
            text: "Checked (controlled)",
            "data-sketch-symbol": "Checked checkbox"
        },
        {
            disabled: true,
            text: "Disabled",
            "data-sketch-symbol": "Disabled checkbox"
        },
        {
            indeterminate: true,
            text: "Indeterminate",
            "data-sketch-symbol": "Indeterminate unchecked checkbox"
        },
        {
            indeterminate: true,
            checked: true,
            text: "Indeterminate checked (controlled)",
            "data-sketch-symbol": "Indeterminate checked checkbox"
        }
    ]
} as ISnapshotTestSuite<ICheckboxHandledProps>;
