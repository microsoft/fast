import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Checkbox from "./index";
import { ICheckboxHandledProps } from "@microsoft/fast-components-react-base";

export default {
    name: "checkbox",
    component: Checkbox,
    data: [
        {
            tag: "div"
        },
        {
            text: "Default"
        },
        {
            checked: true,
            text: "Checked"
        },
        {
            disabled: true,
            text: "Disabled"
        },
        {
            indeterminate: true,
            checked: true,
            text: "Indeterminate"
        }
    ]
} as ISnapshotTestSuite<ICheckboxHandledProps>;
