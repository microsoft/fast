import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Toggle, { IToggleHandledProps, IToggleManagedClasses, IToggleUnhandledProps } from "./toggle";
import * as React from "react";

const examples: ISnapshotTestSuite<IToggleHandledProps & IToggleManagedClasses> = {
    name: "toggle",
    component: Toggle,
    data: [
        {
            managedClasses: {
                toggle: "toggle",
                toggle_label: "toggle_label",
                toggle_wrapper: "toggle_wrapper",
                toggle_input: "toggle_input",
                toggle_button: "toggle_button",
            },
            children: "Toggle label",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: true,
            selectedString: "On",
            statusLabelId: "span01",
            unselectedString: "Off"
        }
    ]
};

export default examples;
