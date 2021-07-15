import React from "react";
import {
    DataType,
    linkedDataSchema,
    mapDataDictionary,
    pluginIdKeyword,
} from "@microsoft/fast-tooling";
import { reactMapper, reactResolver } from "./mapping";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
class Foo extends React.Component {
    render() {
        return <div>{this.props.children}</div>;
    }
}
class Bar extends React.Component {
    render() {
        return <div>{this.props.children}</div>;
    }
}
const componentDictionary = {
    foo: Foo,
    bar: Bar,
};
describe("reactMapper", () => {
    test("should map data to a React component as props", () => {
        const resolvedData = mapDataDictionary({
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
        const mappedData = mount(resolvedData);
        const mappedComponent = mappedData.find("Foo");
        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("text")).toEqual("Hello");
        expect(mappedComponent.prop("number")).toEqual(42);
    });
    test("should map data to a React component as children", () => {
        const resolvedData = mapDataDictionary({
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
                        children: Object.assign({}, linkedDataSchema),
                    },
                },
                bar: {
                    id: "bar",
                    type: "string",
                },
            },
        });
        const mappedData = mount(resolvedData);
        expect(mappedData.find("Foo")).toHaveLength(1);
        expect(mappedData.text()).toEqual("FooHello world");
    });
    test("should map data to nested React components", () => {
        const mappedData = mount(
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
                            children: Object.assign({}, linkedDataSchema),
                        },
                    },
                    bar: {
                        id: "bar",
                        type: "object",
                        properties: {
                            children: Object.assign({}, linkedDataSchema),
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
        const pluginId = "foobarbat";
        function mapperPlugin(data) {
            return "Hello world, " + data;
        }
        const resolvedData = mapDataDictionary({
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
        const mappedData = mount(resolvedData);
        const mappedComponent = mappedData.find("Foo");
        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("text")).toEqual("Hello world, !");
        expect(mappedComponent.prop("number")).toEqual(42);
    });
    test("should resolve data with a plugin", () => {
        const pluginId = "foobarbat";
        function resolverPlugin(data) {
            return "Hello world";
        }
        const resolvedData = mapDataDictionary({
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
                        children: Object.assign(Object.assign({}, linkedDataSchema), {
                            [pluginIdKeyword]: pluginId,
                        }),
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
        const mappedData = mount(resolvedData);
        const mappedComponent = mappedData.find("Foo");
        expect(mappedComponent).toHaveLength(1);
        expect(mappedComponent.prop("children")).toEqual(["Hello world"]);
    });
});
