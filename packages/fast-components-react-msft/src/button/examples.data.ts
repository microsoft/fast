import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import {IButtonHandledProps} from "@microsoft/fast-components-react-base";

export default {
    name: "button",
    component: Button,
    data: [
        {
            children: "Button text"
        }
    ]
} as ISnapshotTestSuite<IButtonHandledProps>;
