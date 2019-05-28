import * as testConfigs from "../form/";

const exampleData: any[] = [
    {
        exampleName: "Basic",
        componentName: "MyComponent",
        componentData: {
            children: "foo",
        },
    },
    {
        exampleName: "Children",
        componentName: "MyComponent",
        componentData: {
            children: [
                {
                    id: testConfigs.textField.schema.id,
                    props: {
                        tag: "span",
                        text: "FooBar",
                    },
                },
                "Text",
                {
                    id: testConfigs.children.schema.id,
                },
                {
                    id: testConfigs.children.schema.id,
                },
            ],
        },
    },
    {
        exampleName: "Child Object",
        componentName: "MyComponent",
        componentData: {
            children: [
                {
                    id: testConfigs.textField.schema.id,
                    props: {
                        tag: "span",
                        text: "FooBar",
                    },
                },
            ],
            badge: {
                id: testConfigs.badge.schema.id,
            },
        },
    },
    {
        exampleName: "Children with Objects",
        componentName: "MyComponent",
        componentData: {
            children: [
                {
                    id: testConfigs.textField.schema.id,
                    props: {
                        tag: "span",
                        text: "FooBar",
                    },
                },
                "Text",
                {
                    id: testConfigs.children.schema.id,
                    props: {
                        objectContainingNestedChildren: {},
                        arrayContainingNestedChildren: [
                            {
                                id: testConfigs.textField.schema.id,
                                props: {
                                    tag: "span",
                                    text: "FooBar",
                                },
                            },
                            {
                                id: testConfigs.textField.schema.id,
                                props: {
                                    tag: "span",
                                    text: "FooBar",
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
];

export default exampleData;
