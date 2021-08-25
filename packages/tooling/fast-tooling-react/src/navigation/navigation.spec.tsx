import React from "react";
import Adapter from "enzyme-adapter-react-16";
import "../__tests__/mocks/match-media";
import { configure, mount, render, shallow } from "enzyme";
import { NavigationProps } from "./navigation.props";
import { ModularNavigation, Navigation } from "./index";
import {
    DataDictionary,
    DataType,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemType,
    NavigationConfig,
    NavigationConfigDictionary,
    Register,
} from "@microsoft/fast-tooling";
import { keyCodeAlt, keyCodeEnter } from "@microsoft/fast-web-utilities";
import {
    linkedDataSchema,
    MessageSystemNavigationTypeAction,
} from "@microsoft/fast-tooling";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const navigationProps: NavigationProps = {
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <ModularNavigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        expect(fastMessageSystem["register"].size).toEqual(1);
    });
    test("should deregister the component with the message system on unmount", () => {
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <ModularNavigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        rendered.unmount();

        expect(fastMessageSystem["register"].size).toEqual(0);
    });
    test("should render a single navigation item as a collapsible item", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should render a single navigation item as an end leaf item", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(3);
    });
    test("should render an item as a rootLinkedData if it is the root item and can contain dropped items", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {},
        };
        const data: any = {};
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                defaultLinkedDataDroppableDataLocation={"children"}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find('div[data-type="root-linked-data"]');
        expect(item).toHaveLength(1);
    });
    test("should render an item as a rootLinkedDataUndroppable if it is a root item cannot contain dropped items", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {},
        };
        const data: any = {};
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find('div[data-type="root-linked-data-undroppable"]');
        expect(item).toHaveLength(1);
    });
    test("should render an item as a linkedDataContainer if it can contain linked data", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                children: {
                    ...linkedDataSchema,
                },
            },
        };
        const data: any = {};
        const navigation: NavigationConfig = [
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
                    items: ["children"],
                },
                children: {
                    self: "children",
                    parent: "",
                    relativeDataLocation: "children",
                    schemaLocation: "properties.children",
                    schema: schema.properties.children,
                    disabled: false,
                    data: void 0,
                    text: "bar",
                    type: DataType.array,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find('div[data-type="linked-data-container"]');
        expect(item).toHaveLength(1);
    });
    test("should render an item as linkedData if it is a linked data", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                children: {
                    title: "Children",
                    ...linkedDataSchema,
                },
            },
        };
        const data: any = {
            children: [
                {
                    id: "foo",
                },
            ],
        };
        const navigation: NavigationConfigDictionary = [
            {
                foo: [
                    {
                        "": {
                            self: "",
                            parent: null,
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema: {
                                $schema: "http://json-schema.org/schema#",
                                title: "Component with children",
                                description: "A test component's schema definition.",
                                type: "object",
                                id: "children",
                                properties: {
                                    children: {
                                        title: "Children",
                                        "@microsoft/fast-tooling/dictionary-link": true,
                                        pluginId: "@microsoft/fast-tooling/linked-data",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    title:
                                                        "The ID of the data corresponding to a dictionary key",
                                                    type: "string",
                                                },
                                                dataLocation: {
                                                    title:
                                                        "The location of the data using lodash path syntax",
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            disabled: false,
                            data: {
                                children: [
                                    {
                                        id: "fast1",
                                    },
                                ],
                            },
                            text: "Component with children",
                            type: DataType.object,
                            items: ["children"],
                        },
                        children: {
                            self: "children",
                            parent: "",
                            relativeDataLocation: "children",
                            schemaLocation: "properties.children",
                            schema: {
                                title: "Children",
                                "@microsoft/fast-tooling/dictionary-link": true,
                                pluginId: "@microsoft/fast-tooling/linked-data",
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            title:
                                                "The ID of the data corresponding to a dictionary key",
                                            type: "string",
                                        },
                                        dataLocation: {
                                            title:
                                                "The location of the data using lodash path syntax",
                                            type: "string",
                                        },
                                    },
                                },
                            },
                            disabled: false,
                            data: [
                                {
                                    id: "fast1",
                                },
                            ],
                            text: "Children",
                            type: DataType.array,
                            items: ["children[0]"],
                        },
                        "children[0]": {
                            self: "children[0]",
                            parent: "children",
                            relativeDataLocation: "children[0]",
                            schemaLocation: "properties.children.items",
                            schema: {
                                type: "object",
                                properties: {
                                    id: {
                                        title:
                                            "The ID of the data corresponding to a dictionary key",
                                        type: "string",
                                    },
                                    dataLocation: {
                                        title:
                                            "The location of the data using lodash path syntax",
                                        type: "string",
                                    },
                                },
                            },
                            text: "foo",
                            disabled: false,
                            data: {
                                id: "fast1",
                            },
                            type: DataType.object,
                            items: ["children[0].id", "children[0].dataLocation"],
                        },
                        "children[0].id": {
                            self: "children[0].id",
                            parent: "children[0]",
                            relativeDataLocation: "children[0].id",
                            schemaLocation: "properties.children.items.properties.id",
                            schema: {
                                title:
                                    "The ID of the data corresponding to a dictionary key",
                                type: "string",
                            },
                            disabled: false,
                            data: "fast1",
                            text: "The ID of the data corresponding to a dictionary key",
                            type: DataType.string,
                            items: [],
                        },
                        "children[0].dataLocation": {
                            self: "children[0].dataLocation",
                            parent: "children[0]",
                            relativeDataLocation: "children[0].dataLocation",
                            schemaLocation:
                                "properties.children.items.properties.dataLocation",
                            schema: {
                                title:
                                    "The location of the data using lodash path syntax",
                                type: "string",
                            },
                            disabled: false,
                            text: "The location of the data using lodash path syntax",
                            type: DataType.string,
                            data: "",
                            items: [],
                        },
                    },
                    "",
                ],
                fast1: [
                    {
                        "": {
                            self: "",
                            parent: null,
                            parentDictionaryItem: {
                                id: "foo",
                                dataLocation: "children",
                            },
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema: {
                                $schema: "http://json-schema.org/schema#",
                                title: "Component without children",
                                description: "A test component's schema definition.",
                                type: "object",
                                id: "no-children",
                                properties: {
                                    text: {
                                        title: "Text",
                                        type: "string",
                                    },
                                },
                            },
                            disabled: false,
                            data: {
                                text: "bar",
                            },
                            text: "Component without children",
                            type: DataType.object,
                            items: ["text"],
                        },
                        text: {
                            self: "text",
                            parent: "",
                            relativeDataLocation: "text",
                            schemaLocation: "properties.text",
                            schema: {
                                title: "Text",
                                type: "string",
                            },
                            disabled: false,
                            data: "bar",
                            text: "Text",
                            type: DataType.string,
                            items: [],
                        },
                    },
                    "",
                ],
            },
            "foo",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                defaultLinkedDataDroppableDataLocation={"children"}
            />
        );

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                dataDictionary: [
                    {
                        foo: {
                            schemaId: schema.id,
                            data: {
                                children: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                        },
                        bar: {
                            parent: {
                                id: "foo",
                                dataLocation: "children",
                            },
                            schemaId: schema.id,
                            data: {
                                text: "bar",
                            },
                        },
                    },
                    "foo",
                ],
                navigationDictionary: navigation,
            });

        const item: any = rendered.find('div[data-type="linked-data"]');
        expect(item).toHaveLength(1);
    });
    test("should render an item as linkedDataUndroppable if it is a linked data and cannot contain dropped items", () => {
        const schema1: any = {
            id: "foo",
            type: "object",
            properties: {
                children: {
                    title: "Children",
                    ...linkedDataSchema,
                },
            },
        };
        const schema2: any = {
            id: "bar",
            type: "string",
        };
        const data: any = {
            children: [
                {
                    id: "foo",
                },
            ],
        };
        const navigation: NavigationConfigDictionary = [
            {
                foo: [
                    {
                        "": {
                            self: "",
                            parent: null,
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema: {
                                $schema: "http://json-schema.org/schema#",
                                title: "Component with children",
                                description: "A test component's schema definition.",
                                type: "object",
                                id: "children",
                                properties: {
                                    children: {
                                        title: "Children",
                                        "@microsoft/fast-tooling/dictionary-link": true,
                                        pluginId: "@microsoft/fast-tooling/linked-data",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    title:
                                                        "The ID of the data corresponding to a dictionary key",
                                                    type: "string",
                                                },
                                                dataLocation: {
                                                    title:
                                                        "The location of the data using lodash path syntax",
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            disabled: false,
                            data: {
                                children: [
                                    {
                                        id: "fast1",
                                    },
                                ],
                            },
                            text: "Component with children",
                            type: DataType.object,
                            items: ["children"],
                        },
                        children: {
                            self: "children",
                            parent: "",
                            relativeDataLocation: "children",
                            schemaLocation: "properties.children",
                            schema: {
                                title: "Children",
                                "@microsoft/fast-tooling/dictionary-link": true,
                                pluginId: "@microsoft/fast-tooling/linked-data",
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            title:
                                                "The ID of the data corresponding to a dictionary key",
                                            type: "string",
                                        },
                                        dataLocation: {
                                            title:
                                                "The location of the data using lodash path syntax",
                                            type: "string",
                                        },
                                    },
                                },
                            },
                            disabled: false,
                            data: [
                                {
                                    id: "fast1",
                                },
                            ],
                            text: "Children",
                            type: DataType.array,
                            items: ["children[0]"],
                        },
                        "children[0]": {
                            self: "children[0]",
                            parent: "children",
                            relativeDataLocation: "children[0]",
                            schemaLocation: "properties.children.items",
                            schema: {
                                type: "object",
                                properties: {
                                    id: {
                                        title:
                                            "The ID of the data corresponding to a dictionary key",
                                        type: "string",
                                    },
                                    dataLocation: {
                                        title:
                                            "The location of the data using lodash path syntax",
                                        type: "string",
                                    },
                                },
                            },
                            text: "foo",
                            disabled: false,
                            data: {
                                id: "fast1",
                            },
                            type: DataType.object,
                            items: ["children[0].id", "children[0].dataLocation"],
                        },
                        "children[0].id": {
                            self: "children[0].id",
                            parent: "children[0]",
                            relativeDataLocation: "children[0].id",
                            schemaLocation: "properties.children.items.properties.id",
                            schema: {
                                title:
                                    "The ID of the data corresponding to a dictionary key",
                                type: "string",
                            },
                            disabled: false,
                            data: "fast1",
                            text: "The ID of the data corresponding to a dictionary key",
                            type: DataType.string,
                            items: [],
                        },
                        "children[0].dataLocation": {
                            self: "children[0].dataLocation",
                            parent: "children[0]",
                            relativeDataLocation: "children[0].dataLocation",
                            schemaLocation:
                                "properties.children.items.properties.dataLocation",
                            schema: {
                                title:
                                    "The location of the data using lodash path syntax",
                                type: "string",
                            },
                            disabled: false,
                            text: "The location of the data using lodash path syntax",
                            type: DataType.string,
                            data: "",
                            items: [],
                        },
                    },
                    "",
                ],
                fast1: [
                    {
                        "": {
                            self: "",
                            parent: null,
                            parentDictionaryItem: {
                                id: "foo",
                                dataLocation: "children",
                            },
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema: {
                                $schema: "http://json-schema.org/schema#",
                                title: "Component without children",
                                description: "A test component's schema definition.",
                                type: "string",
                                id: "no-children",
                            },
                            disabled: false,
                            data: "bar",
                            text: "Component without children",
                            type: DataType.string,
                            items: [],
                        },
                    },
                    "",
                ],
            },
            "foo",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema1.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema1.id]: schema1,
                [schema2.id]: schema2,
            },
        });

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                defaultLinkedDataDroppableDataLocation={"children"}
            />
        );

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                dataDictionary: [
                    {
                        foo: {
                            schemaId: schema1.id,
                            data: {
                                children: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                        },
                        fast1: {
                            parent: {
                                id: "foo",
                                dataLocation: "children",
                            },
                            schemaId: schema2.id,
                            data: "bar",
                        },
                    },
                    "foo",
                ],
                navigationDictionary: navigation,
            });

        const item: any = rendered.find('div[data-type="linked-data-undroppable"]');
        expect(item).toHaveLength(1);
    });
    test("should render an item as a undraggableUndroppable item if it is not a root container, linked data container or linked data itself", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                children: {
                    title: "Children",
                    type: "object",
                },
            },
        };
        const data: any = {
            children: {},
        };
        const navigation: NavigationConfigDictionary = [
            {
                foo: [
                    {
                        "": {
                            self: "",
                            parent: null,
                            relativeDataLocation: "",
                            schemaLocation: "",
                            schema: {
                                $schema: "http://json-schema.org/schema#",
                                title: "Component with children",
                                description: "A test component's schema definition.",
                                type: "object",
                                id: "children",
                                properties: {
                                    children: {
                                        title: "Children",
                                        type: "object",
                                    },
                                },
                            },
                            disabled: false,
                            data: {
                                children: {},
                            },
                            text: "Component with children",
                            type: DataType.object,
                            items: ["children"],
                        },
                        children: {
                            self: "children",
                            parent: "",
                            relativeDataLocation: "children",
                            schemaLocation: "properties.children",
                            schema: {
                                title: "Children",
                                type: "object",
                            },
                            disabled: false,
                            data: {},
                            text: "Children",
                            type: DataType.object,
                            items: [],
                        },
                    },
                    "",
                ],
            },
            "foo",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                dataDictionary: [
                    {
                        foo: {
                            schemaId: schema.id,
                            data: {
                                children: {},
                            },
                        },
                    },
                    "foo",
                ],
                navigationDictionary: navigation,
            });

        const item: any = rendered.find('div[data-type="undraggable-undroppable"]');
        expect(item).toHaveLength(1);
    });
    test("should render an input if the display item has an editActiveItem state of true", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const inputs1: any = rendered.find("input");
        expect(inputs1).toHaveLength(0);
        const item: any = rendered.find("a");
        expect(item).toHaveLength(1);

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                textEditing: {
                    dictionaryId: "",
                    navigationConfigId: "",
                },
            });

        const inputs2: any = rendered.find("input");
        expect(inputs2).toHaveLength(1);
    });
    test("should remove an input if the display item input has been defocused", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find("a");

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                textEditing: {
                    dictionaryId: "",
                    navigationConfigId: "",
                },
            });

        const inputs1: any = rendered.find("input");
        inputs1.simulate("blur");
        const inputs3: any = rendered.find("input");
        expect(inputs3).toHaveLength(0);
    });
    test("should remove an input if the display item input has logged an Enter key", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const item: any = rendered.find("a");

        rendered
            .find("Navigation")
            .at(1)
            .setState({
                textEditing: {
                    dictionaryId: "",
                    navigationConfigId: "",
                },
            });

        const inputs1: any = rendered.find("input");
        inputs1.simulate("keydown", { keyCode: keyCodeEnter });
        const inputs3: any = rendered.find("input");
        expect(inputs3).toHaveLength(0);
    });
    test("should toggle the expand state on an item if the expand item trigger has been clicked", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
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

        const containingNavigationItem: any = rendered.find('div[role="treeitem"]').at(1);
        const expandTrigger: any = containingNavigationItem.find("span").at(1);

        expect(containingNavigationItem.prop("aria-expanded")).toBe(false);

        expandTrigger.simulate("click");

        expect(rendered.find('div[role="treeitem"]').at(1).prop("aria-expanded")).toBe(
            true
        );

        expandTrigger.simulate("click");

        expect(rendered.find('div[role="treeitem"]').at(1).prop("aria-expanded")).toBe(
            false
        );
    });
    test("should update the navigations expanded items to include the navigation item parents when a message system navigation message is sent", () => {
        const schema: any = {
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
                children: {
                    ...linkedDataSchema,
                },
            },
        };
        const data: any = {
            children: [
                {
                    id: "foo",
                },
            ],
        };
        const dataDictionary: DataDictionary<any> = [
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
        const navigation1: NavigationConfig = [
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
        const navigation2: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary,
            schemaDictionary: {
                [schema.id]: schema,
            },
        });

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const expandedItemsBefore = rendered.find("[aria-expanded=true]");

        expect(expandedItemsBefore.length).toEqual(0);

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: "foo",
                    activeNavigationConfigId: "",
                },
            } as any);
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
    test("should update the navigations expanded items to include any non-dictionary expandable item when a message system navigation message is sent", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                obj: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
                children: {
                    ...linkedDataSchema,
                },
            },
        };
        const data: any = {
            children: [
                {
                    id: "foo",
                },
            ],
        };
        const dataDictionary: DataDictionary<any> = [
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
                        obj: {},
                    },
                },
            },
            "",
        ];
        const navigation1: NavigationConfig = [
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
                    items: ["obj", "children"],
                },
                obj: {
                    self: "obj",
                    parent: "",
                    relativeDataLocation: "obj",
                    schemaLocation: "properties.obj",
                    schema,
                    disabled: false,
                    data: {},
                    text: "obj",
                    type: DataType.object,
                    items: [],
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
        const navigation2: NavigationConfig = [
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
                        obj: {},
                    },
                    text: "bar",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary,
            schemaDictionary: {
                [schema.id]: schema,
            },
        });

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        expect(rendered.find("[aria-expanded=true]").length).toEqual(0);

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: "foo",
                    activeNavigationConfigId: "",
                },
            } as any);
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

        const containedObjectNavigationItem: any = rendered
            .find('div[role="treeitem"]')
            .at(2);
        const containedObjectExpandTrigger: any = containedObjectNavigationItem
            .find("span")
            .at(1);

        containedObjectExpandTrigger.simulate("click");

        expect(rendered.find("[aria-expanded=true]").length).toEqual(4);
    });
    test("should only render object types if objects have been specified", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.object]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render array types if arrays have been specified", () => {
        const schema: any = {
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
        const data: any = {
            bar: "hello world",
        };
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.array]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render number types if numbers have been specified", () => {
        const schema: any = {
            id: "foo",
            type: "number",
        };
        const data: number = 5;
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.number]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render string types if strings have been specified", () => {
        const schema: any = {
            id: "foo",
            type: "string",
        };
        const data: string = "bar";
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.string]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render boolean types if booleans have been specified", () => {
        const schema: any = {
            id: "foo",
            type: "boolean",
        };
        const data: boolean = true;
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.boolean]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
    test("should only render null types if nulls have been specified", () => {
        const schema: any = {
            id: "foo",
            type: "null",
        };
        const data: boolean = true;
        const navigation: NavigationConfig = [
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
        const fastMessageSystem: MessageSystem = new MessageSystem({
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

        const rendered: any = mount(
            <Navigation
                {...navigationProps}
                messageSystem={fastMessageSystem}
                types={[DataType.null]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        const renderedNavigation: any = rendered.find("Navigation").at(1);

        renderedNavigation.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(2);
    });
});
