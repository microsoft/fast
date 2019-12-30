import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Toggle,
    ToggleHandledProps,
    ToggleProps,
    toggleSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/toggle/guidance";
import API from "../api";

const toggleProps: Pick<
    ToggleHandledProps,
    "selectedMessage" | "unselectedMessage" | "statusMessageId" | "inputId"
> = {
    selectedMessage: "selected",
    unselectedMessage: "unselected",
    statusMessageId: uniqueId(),
    inputId: uniqueId(),
};

const toggleConfig: ComponentViewConfig<ToggleProps> = {
    api: API(React.lazy(() => import("../../.tmp/toggle/api"))),
    schema: toggleSchema,
    component: Toggle,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Unselected",
            data: {
                selected: false,
                ...toggleProps,
            },
        },
        {
            displayName: "Selected",
            data: {
                selected: true,
                ...toggleProps,
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                ...toggleProps,
            },
        },
    ],
};

export default toggleConfig;
