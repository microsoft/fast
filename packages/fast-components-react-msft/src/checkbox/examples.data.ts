import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Checkbox from "./index";
import { ICheckboxHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/checkbox/checkbox.schema.json";

export default {
    name: "checkbox",
    component: Checkbox,
    schema,
    data: [
        {
            text: "Default"
        },
        {
            tag: "div",
            text: "div tag"
        },
        {
            checked: true,
            text: "Checked (controlled)"
        },
        {
            disabled: true,
            text: "Disabled"
        },
        {
            indeterminate: true,
            text: "Indeterminate"
        },
        {
            indeterminate: true,
            checked: true,
            text: "Indeterminate checked (controlled)"
        }
    ]
} as ISnapshotTestSuite<ICheckboxHandledProps>;
