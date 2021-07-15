import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ModularNavigation, Navigation } from "./index";
import { DataType, MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";
import {
    linkedDataSchema,
    MessageSystemNavigationTypeAction,
} from "@microsoft/fast-tooling";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const navigationProps = {
    messageSystem: void 0,
};
describe("Navigation", () => {
    test("should not throw if there is no drag and drop available", () => {
        expect(() => {
            shallow(<ModularNavigation {...navigationProps} />);
        }).not.toThrow();
    });
    test("should not throw if drag and drop is available", () => {
        expect(() => {
            shallow(<Navigation {...navigationProps} />);
        }).not.toThrow();
    });
    test("should register with the message system", () => {
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    type: "object",
                    properties: {
                        foo: {
                            type: "string",
                        },
                    },
                },
            },
        });
        expect(fastMessageSystem["register"].size).toEqual(0);
        const rendered = mount(
            <ModularNavigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        expect(fastMessageSystem["register"].size).toEqual(1);
    });
    test("should deregister the component with the message system on unmount", () => {
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    type: "object",
                    properties: {
                        foo: {
                            type: "string",
                        },
                    },
                },
            },
        });
        const rendered = mount(
            <ModularNavigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        rendered.unmount();
        expect(fastMessageSystem["register"].size).toEqual(0);
    });
    test("should render a single navigation item as a collapsible item", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        rendered
            .find("Navigation")
            .at(1)
            .setState({
                navigationDictionary: [
                    {
                        "": navigation,
                    },
                    "",
                ],
            });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should render a single navigation item as an end leaf item", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(3);
    });
    test("should render an input if the display item has an editActiveItem state of true", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        rendered
            .find("Navigation")
            .at(1)
            .setState({
                navigationDictionary: [
                    {
                        "": navigation,
                    },
                    "",
                ],
            });
        const inputs1 = rendered.find("input");
        expect(inputs1).toHaveLength(0);
        const item = rendered.find("a");
        expect(item).toHaveLength(1);
        rendered.find("Navigation").at(1).setState({
            activeItemEditable: true,
        });
        const inputs2 = rendered.find("input");
        expect(inputs2).toHaveLength(1);
    });
    test("should remove an input if the display item input has been defocused", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        rendered
            .find("Navigation")
            .at(1)
            .setState({
                navigationDictionary: [
                    {
                        "": navigation,
                    },
                    "",
                ],
            });
        const item = rendered.find("a");
        rendered.find("Navigation").at(1).setState({
            activeItemEditable: true,
        });
        const inputs1 = rendered.find("input");
        inputs1.simulate("blur");
        const inputs3 = rendered.find("input");
        expect(inputs3).toHaveLength(0);
    });
    test("should remove an input if the display item input has logged an Enter key", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        rendered
            .find("Navigation")
            .at(1)
            .setState({
                navigationDictionary: [
                    {
                        "": navigation,
                    },
                    "",
                ],
            });
        const item = rendered.find("a");
        rendered.find("Navigation").at(1).setState({
            activeItemEditable: true,
        });
        const inputs1 = rendered.find("input");
        inputs1.simulate("keydown", { keyCode: keyCodeEnter });
        const inputs3 = rendered.find("input");
        expect(inputs3).toHaveLength(0);
    });
    test("should update the navigations expanded items to include the navigation item parents when a message system navigation message is sent", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
                children: Object.assign({}, linkedDataSchema),
            },
        };
        const data = {
            children: [
                {
                    id: "foo",
                },
            ],
        };
        const dataDictionary = [
            {
                "": {
                    schemaId: schema.id,
                    data,
                },
                foo: {
                    parent: {
                        id: "",
                        dataLocation: "children",
                    },
                    schemaId: schema.id,
                    data: {
                        bar: "Hello world",
                    },
                },
            },
            "",
        ];
        const navigation1 = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "foo",
                    type: DataType.object,
                    items: ["children"],
                },
                children: {
                    self: "children",
                    parent: "",
                    relativeDataLocation: "children",
                    schemaLocation: "properties.children",
                    schema: schema.properties.children,
                    disabled: false,
                    data: data.children,
                    text: "children",
                    type: DataType.array,
                    items: [""],
                },
            },
            "",
        ];
        const navigation2 = [
            {
                "": {
                    self: "",
                    parent: "",
                    parentDictionaryItem: {
                        id: "",
                        dataLocation: "children",
                    },
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data: {
                        bar: "Hello world",
                    },
                    text: "bar",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary,
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary,
                    navigationDictionary: [
                        {
                            "": navigation1,
                            foo: navigation2,
                        },
                        "",
                    ],
                    navigation: navigation1,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const expandedItemsBefore = rendered.find("[aria-expanded=true]");
        expect(expandedItemsBefore.length).toEqual(0);
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: "foo",
                    activeNavigationConfigId: "",
                },
            });
        });
        rendered
            .find("Navigation")
            .at(1)
            .setState({
                navigationDictionary: [
                    {
                        "": navigation1,
                        foo: navigation2,
                    },
                    "",
                ],
            });
        const expandedItemsAfter = rendered.find("[aria-expanded=true]");
        expect(expandedItemsAfter.length).toEqual(3);
    });
    test("should only render object types if objects have been specified", () => {
        const schema = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.object]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render array types if arrays have been specified", () => {
        const schema = {
            id: "foo",
            type: "array",
            items: {
                type: "object",
                properties: {
                    bar: {
                        type: "string",
                    },
                },
            },
        };
        const data = {
            bar: "hello world",
        };
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.array,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.array]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render number types if numbers have been specified", () => {
        const schema = {
            id: "foo",
            type: "number",
        };
        const data = 5;
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.number]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render string types if strings have been specified", () => {
        const schema = {
            id: "foo",
            type: "string",
        };
        const data = "bar";
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.string]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render boolean types if booleans have been specified", () => {
        const schema = {
            id: "foo",
            type: "boolean",
        };
        const data = true;
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.boolean,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.boolean]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render null types if nulls have been specified", () => {
        const schema = {
            id: "foo",
            type: "null",
        };
        const data = true;
        const navigation = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "bat",
                    type: DataType.null,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });
        const rendered = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.null]}
            />
        );
        fastMessageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        const renderedNavigation = rendered.find("Navigation").at(1);
        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });
        const item = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
});
