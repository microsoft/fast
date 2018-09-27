import * as React from "react";
import Toggle, { IToggleHandledProps, IToggleManagedClasses, IToggleUnhandledProps } from "./toggle";
import schema from "./toggle.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<IToggleHandledProps & IToggleManagedClasses> = {
    name: "Toggle",
    component: Toggle,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            toggle: "toggle",
            toggle_label: "toggle_label",
            toggle_toggleButton: "toggle_toggleButton",
            toggle_input: "toggle_input",
            toggle_stateIndicator: "toggle_stateIndicator",
        },
        children: "Toggle",
        id: "toggle01",
        labelId: "label01",
        selectedMessage: "On",
        statusMessageId: "span01",
        unselectedMessage: "Off"
    },
    data: [
        {
            managedClasses: {
                toggle: "toggle",
                toggle_label: "toggle_label",
                toggle_toggleButton: "toggle_toggleButton",
                toggle_input: "toggle_input",
                toggle_stateIndicator: "toggle_stateIndicator",
            },
            children: "Toggle label",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: true,
            selectedMessage: "On",
            statusMessageId: "span01",
            unselectedMessage: "Off"
        }
    ]
};

export default examples;
