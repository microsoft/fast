import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Toggle, { IToggleHandledProps, IToggleManagedClasses, IToggleUnhandledProps } from "./toggle";
import * as schema from "./toggle.schema.json";
import * as React from "react";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<IToggleHandledProps & IToggleManagedClasses> = {
    name: "toggle",
    component: Toggle,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            toggle: "toggle",
            toggle_label: "toggle_label",
            toggle_wrapper: "toggle_wrapper",
            toggle_input: "toggle_input",
            toggle_button: "toggle_button",
        },
        children: "Toggle",
        id: "toggle01",
        labelId: "label01",
        selectedString: "On",
        statusLabelId: "span01",
        unselectedString: "Off"
    },
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
