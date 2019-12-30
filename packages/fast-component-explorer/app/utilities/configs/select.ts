import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Select,
    SelectOptionProps,
    selectOptionSchema,
    SelectProps,
    selectSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/select/guidance";

function selectOptionPropFactory(value: string): SelectOptionProps {
    return {
        id: uniqueId(),
        value,
        displayString: value,
    };
}

const selectConfig: ComponentViewConfig<SelectProps> = {
    api: ((): string => "Coming soon") as any, // TODO Select's API is malformed for some reason, need to look into why
    schema: selectSchema,
    component: Select,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                placeholder: "Select an option",
                children: [
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 1"),
                        },
                    },
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 2"),
                        },
                    },
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 2"),
                        },
                    },
                ],
            },
        },
    ],
};

export default selectConfig;
