import React from "react";
import { dictionaryLink, mapDataDictionary } from "@microsoft/fast-tooling";
import { ComponentDictionary, reactMapper } from "./mapping";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/* tslint:disable:max-classes-per-file */
class Foo extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return this.props.children;
    }
}

class Bar extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return this.props.children;
    }
}

const componentDictionary: ComponentDictionary = {
    foo: Foo,
    bar: Bar,
};

describe("reactMapper", () => {
    test("should map data to a React component as props", () => {
        const mappedData: any = mount(
            mapDataDictionary({
                dataDictionary: {
                    foo: {
                        schemaId: "foo",
                        data: {
                            children: "Hello world",
                        },
                    },
                },
                dataDictionaryKey: "foo",
                mapper: reactMapper(componentDictionary),
                schemaDictionary: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            children: {
                                type: "string",
                            },
                        },
                    },
                },
            })
        );

        expect(mappedData.find("Foo")).toHaveLength(1);
        expect(mappedData.text()).toEqual("Hello world");
    });
    test("should map data to nested React components", () => {
        const mappedData: any = mount(
            mapDataDictionary({
                dataDictionary: {
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
                            children: "Hello world",
                        },
                    },
                },
                dataDictionaryKey: "foo",
                mapper: reactMapper(componentDictionary),
                schemaDictionary: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            children: {
                                [dictionaryLink]: true,
                            },
                        },
                    },
                    bar: {
                        id: "bar",
                        type: "object",
                        properties: {
                            children: {
                                type: "string",
                            },
                        },
                    },
                },
            })
        );

        expect(mappedData.find("Foo")).toHaveLength(1);
        expect(mappedData.find("Bar")).toHaveLength(1);
        expect(mappedData.text()).toEqual("Hello world");
    });
});
