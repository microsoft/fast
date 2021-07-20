import React from "react";
import "../__tests__/mocks/match-media";
import {
    DataType,
    dictionaryLink,
    linkedDataSchema,
    mapDataDictionary,
    pluginIdKeyword,
} from "@microsoft/fast-tooling";
import { ComponentDictionary, reactMapper, reactResolver } from "./mapping";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

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
                            text: "Hello",
                            number: 42,
                        },
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
                        text: {
                            type: "string",
                        },
                        number: {
                            type: "number",
                        },
                    },
                },
            },
        });
        const mappedData: any = mount(resolvedData);
        const mappedComponent: any = mappedData.find("Foo");

        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("text")).toEqual("Hello");
        expect(mappedComponent.prop("number")).toEqual(42);
    });
    test("should map data to a React component as children", () => {
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
    test("should map data with a plugin", () => {
        const pluginId: string = "foobarbat";
        function mapperPlugin(data: any): any {
            return "Hello world, " + data;
        }
        const resolvedData: any = mapDataDictionary({
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: {
                            text: "!",
                            number: 42,
                        },
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
                        text: {
                            [pluginIdKeyword]: pluginId,
                            type: "string",
                        },
                        number: {
                            type: "number",
                        },
                    },
                },
            },
            plugins: [
                {
                    ids: [pluginId],
                    mapper: mapperPlugin,
                    resolver: undefined,
                },
            ],
        });
        const mappedData: any = mount(resolvedData);
        const mappedComponent: any = mappedData.find("Foo");

        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("text")).toEqual("Hello world, !");
        expect(mappedComponent.prop("number")).toEqual(42);
    });
    test("should resolve data with a plugin", () => {
        const pluginId: string = "foobarbat";
        function resolverPlugin(data: any): any {
            return "Hello world";
        }
        const resolvedData: any = mapDataDictionary({
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
                        schemaId: "foo",
                        parent: {
                            id: "foo",
                            dataLocation: "children",
                        },
                        data: {},
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
                            [pluginIdKeyword]: pluginId,
                        },
                    },
                },
            },
            plugins: [
                {
                    ids: [pluginId],
                    mapper: undefined,
                    resolver: resolverPlugin,
                },
            ],
        });
        const mappedData: any = mount(resolvedData);
        const mappedComponent: any = mappedData.find("Foo");

        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("children")).toEqual(["Hello world"]);
    });
});
