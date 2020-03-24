import React from "react";
import {
    DataType,
    dictionaryLink,
    linkedDataSchema,
    mapDataDictionary,
} from "@microsoft/fast-tooling";
import { ComponentDictionary, reactMapper, reactResolver } from "./mapping";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/* tslint:disable:max-classes-per-file */
class Foo extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.children}</div>;
    }
}

class Bar extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.children}</div>;
    }
}

const componentDictionary: ComponentDictionary = {
    foo: Foo,
    bar: Bar,
};

describe("reactMapper", () => {
    test("should map data to a React component as props", () => {
        const resolvedData: any = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            children: [
                                {
                                    id: "bat",
                                },
                                {
                                    id: "bar",
                                },
                            ],
                        },
                    },
                    bar: {
                        schemaId: "bar",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: "Hello world",
                    },
                    bat: {
                        schemaId: "bar",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: "Foo",
                    },
                },
                "foo",
            ],
            mapper: reactMapper(componentDictionary),
            resolver: reactResolver,
            schemaDictionary: {
                foo: {
                    id: "foo",
                    type: "object",
                    properties: {
                        children: {
                            ...linkedDataSchema,
                        },
                    },
                },
                bar: {
                    id: "bar",
                    type: "string",
                },
            },
        });
        const mappedData: any = mount(resolvedData);

        expect(mappedData.find("Foo")).toHaveLength(1);
        expect(mappedData.text()).toEqual("FooHello world");
    });
    test("should map data to nested React components", () => {
        const mappedData: any = mount(
            mapDataDictionary({
                dataDictionary: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {
                                children: [
                                    {
                                        id: "bar",
                                        dataLocation: "children",
                                    },
                                ],
                            },
                        },
                        bar: {
                            schemaId: "bar",
                            parent: {
                                id: "foo",
                                dataLocation: "children",
                            },
                            data: {
                                children: [
                                    {
                                        id: "bat",
                                    },
                                ],
                            },
                        },
                        bat: {
                            schemaId: "bat",
                            parent: {
                                id: "bar",
                                dataLocation: "children",
                            },
                            data: "Hello world",
                        },
                    },
                    "foo",
                ],
                mapper: reactMapper(componentDictionary),
                resolver: reactResolver,
                schemaDictionary: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            children: {
                                ...linkedDataSchema,
                            },
                        },
                    },
                    bar: {
                        id: "bar",
                        type: "object",
                        properties: {
                            children: {
                                ...linkedDataSchema,
                            },
                        },
                    },
                    bat: {
                        id: "bat",
                        type: DataType.string,
                    },
                },
            })
        );

        expect(mappedData.find("Foo")).toHaveLength(1);
        expect(mappedData.find("Bar")).toHaveLength(1);
        expect(mappedData.text()).toEqual("Hello world");
    });
});
