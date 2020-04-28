import {
    Toggle,
    ToggleHandledProps,
    toggleSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/toggle/guidance";
import { ComponentViewConfig } from "./data.props";

const toggleProps: Pick<
    ToggleHandledProps,
    "selectedMessage" | "unselectedMessage" | "statusMessageId" | "inputId"
> = {
    selectedMessage: "selected",
    unselectedMessage: "unselected",
    statusMessageId: uniqueId(),
    inputId: uniqueId(),
};

const toggleConfig: ComponentViewConfig = {
    schema: toggleSchema2,
    component: Toggle,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Unselected",
            dataDictionary: [
                {
                    root: {
                        schemaId: toggleSchema2.id,
                        data: {
                            selected: false,
                            ...toggleProps,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Selected",
            dataDictionary: [
                {
                    root: {
                        schemaId: toggleSchema2.id,
                        data: {
                            selected: true,
                            ...toggleProps,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Disabled",
            dataDictionary: [
                {
                    root: {
                        schemaId: toggleSchema2.id,
                        data: {
                            disabled: true,
                            ...toggleProps,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default toggleConfig;
