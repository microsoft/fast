import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./select.schema.json";
import selectOptionSchema from "../select-option/select-option.schema.json";
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
                id: selectOptionSchema.id,
                props: {
                    ...selectOptionPropFactory("a"),
                },
            },
            {
                id: selectOptionSchema.id,
                props: {
                    ...selectOptionPropFactory("b"),
                },
            },
            {
                id: selectOptionSchema.id,
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
                    id: selectOptionSchema.id,
                    props: {
                        ...selectOptionPropFactory("value 1"),
                        children: "select option 1",
                        selected: true,
                    },
                },
                {
                    id: selectOptionSchema.id,
                    props: {
                        ...selectOptionPropFactory("value 2"),
                        children: "select option 2",
                    },
                },
                {
                    id: selectOptionSchema.id,
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
