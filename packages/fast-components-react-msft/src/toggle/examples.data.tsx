import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Toggle, ToggleProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/toggle/toggle.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Toggle",
    component: Toggle,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Toggle label default on",
        inputId: "toggle01",
        labelId: "label01",
        selectedMessage: "On",
        statusMessageId: "span01",
        unselectedMessage: "Off",
    },
    data: [
        {
            children: "Toggle label default on",
            disabled: false,
            inputId: "toggle01",
            labelId: "label01",
            selected: true,
            selectedMessage: "On",
            statusMessageId: "span01",
            unselectedMessage: "Off",
            "data-sketch-symbol": "Toggle (on)",
        },
        {
            children: "Toggle label default off",
            disabled: false,
            inputId: "toggle02",
            labelId: "label02",
            selected: false,
            selectedMessage: "On",
            statusMessageId: "span02",
            unselectedMessage: "Off",
            "data-sketch-symbol": "Toggle (off)",
        },
        {
            children: "Toggle label disabled on",
            disabled: true,
            inputId: "toggle03",
            labelId: "label03",
            selected: true,
            selectedMessage: "On",
            statusMessageId: "span03",
            unselectedMessage: "Off",
            "data-sketch-symbol": "Toggle disabled (on)",
        },
        {
            children: "Toggle label disabled off",
            disabled: true,
            inputId: "toggle04",
            labelId: "label04",
            selected: false,
            selectedMessage: "On",
            statusMessageId: "span04",
            unselectedMessage: "Off",
            "data-sketch-symbol": "Toggle disabled (off)",
        } as any, // TODO github.com/Microsoft/fast-dna/issues/982
    ],
} as ComponentFactoryExample<ToggleProps>;
