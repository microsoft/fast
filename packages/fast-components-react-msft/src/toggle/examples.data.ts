import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Toggle from "./index";
import { IToggleHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/toggle/toggle.schema.json";

export default {
    name: "toggle",
    component: Toggle,
    schema,
    data: [
        {
            children: "Toggle label (default on)",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: true,
            selectedString: "On",
            statusLabelId: "span01",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (default off)",
            disabled: false,
            id: "toggle02",
            labelId: "label02",
            selected: false,
            selectedString: "On",
            statusLabelId: "span02",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (disabled on)",
            disabled: true,
            id: "toggle03",
            labelId: "label03",
            selected: true,
            selectedString: "On",
            statusLabelId: "span03",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (disabled off)",
            disabled: true,
            id: "toggle04",
            labelId: "label04",
            selected: false,
            selectedString: "On",
            statusLabelId: "span04",
            unselectedString: "Off"
        }
    ]
} as ISnapshotTestSuite<IToggleHandledProps>;
