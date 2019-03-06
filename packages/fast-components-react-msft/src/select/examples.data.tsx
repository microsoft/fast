import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./select.schema.json";
import { Select, SelectProps } from "./index";
import { SelectOptionProps } from "../select-option";
import Documentation from "./.tmp/documentation";

function selectOptionPropFactory(id: string): SelectOptionProps {
    return {
        id,
        value: id,
        role: "option",
        displayString: "Option-" + id,
    };
}

const examples: ComponentFactoryExample<SelectProps> = {
    name: "Select",
    component: Select,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        placeholder: "Select an option",
        children: [
            {
                id: "@microsoft/fast-components-react-msft/select-option",
                props: {
                    ...selectOptionPropFactory("a"),
                },
            },
            {
                id: "@microsoft/fast-components-react-msft/select-option",
                props: {
                    ...selectOptionPropFactory("b"),
                },
            },
            {
                id: "@microsoft/fast-components-react-msft/select-option",
                props: {
                    ...selectOptionPropFactory("c"),
                },
            },
        ],
    },
    data: [
        {
            placeholder: "placeholder",
            children: [
                {
                    id: "@microsoft/fast-components-react-msft/select-option",
                    props: {
                        ...selectOptionPropFactory("value 1"),
                        children: "select option 1",
                        selected: true,
                    },
                },
                {
                    id: "@microsoft/fast-components-react-msft/select-option",
                    props: {
                        ...selectOptionPropFactory("value 2"),
                        children: "select option 2",
                    },
                },
                {
                    id: "@microsoft/fast-components-react-msft/select-option",
                    props: {
                        ...selectOptionPropFactory("value 3"),
                        children: "select option 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
