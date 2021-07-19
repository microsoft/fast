import React from "react";
import Adapter from "enzyme-adapter-react-16";
import "../__tests__/mocks/match-media";
import { configure, mount, render, shallow } from "enzyme";
import { Form, ModularForm } from "./";
import { FormProps } from "./form.props";
import {
    DataType,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemType,
    NavigationConfig,
    Register,
} from "@microsoft/fast-tooling";

import {
    arraysSchema as arraySchema,
    childrenSchema,
    invalidDataSchema,
    objectsSchema as objectSchema,
} from "../__tests__/schemas";

import { ControlConfig, ControlType, StandardControlPlugin } from "./templates";
import { TextareaControl } from "./controls/control.textarea";
import { CheckboxControl } from "./controls/control.checkbox";
import { ButtonControl } from "./controls/control.button";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formProps: FormProps = {
    messageSystem: void 0,
};

describe("Form", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Form {...formProps} />);
        }).not.toThrow();
    });
    test("should register the component with a message system", () => {
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
                },
            },
        });

        expect(fastMessageSystem["register"].size).toEqual(0);

        mount(<Form {...formProps} messageSystem={fastMessageSystem} />);

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
                },
            },
        });

        const formInstance: any = mount(
            <Form {...formProps} messageSystem={fastMessageSystem} />
        );

        formInstance.unmount();

        expect(fastMessageSystem["register"].size).toEqual(0);
    });
    test("should show a section link if the schema contains a property which is an object", () => {
        const data: any = {
            bar: {},
        };
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
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
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

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("SectionLinkControl")).toHaveLength(1);
    });
    test("should show a checkbox if the schema contains a property which is a boolean", () => {
        const data: any = {
            bar: true,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "boolean",
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("CheckboxControl")).toHaveLength(1);
    });
    test("should show a textarea if the schema contains a property which is a string", () => {
        const data: any = {
            bar: "hello world",
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("TextareaControl")).toHaveLength(1);
    });
    test("should show a numberfield if the schema contains a property which is a number", () => {
        const data: any = {
            bar: 42,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "number",
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("NumberFieldControl")).toHaveLength(1);
    });
    test("should show a select if the schema contains a property which is an enum", () => {
        const data: any = {
            bar: 42,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "number",
                    enum: [42, 24],
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });
        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("SelectControl")).toHaveLength(1);
    });
    test("should show a display if the schema contains a property which is a const", () => {
        const data: any = {
            const: 42,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                const: {
                    type: "number",
                    const: 42,
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.const,
                    disabled: false,
                    data: data.const,
                    text: "bat",
                    type: DataType.number,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("DisplayControl")).toHaveLength(1);
    });
    test("should show a button if the schema contains a property which is null", () => {
        const data: any = {
            bar: null,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "null",
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("ButtonControl")).toHaveLength(1);
    });
    test("should show an array if the schema contains a property which is an array", () => {
        const data: any = {
            bar: [],
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.array,
                    items: [],
                },
            },
            "abc",
        ];

        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("ArrayControl")).toHaveLength(1);
    });
    test("should not show breadcrumbs if the navigation location is at the root level", () => {
        const schemaDictionary: { [key: string]: any } = {
            foo: {
                id: "foo",
                type: "object",
                properties: {
                    bar: {
                        type: "object",
                        properties: {},
                    },
                },
            },
        };
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    abc: {
                        schemaId: "foo",
                        data: {
                            bar: {},
                        },
                    },
                },
                "abc",
            ],
            schemaDictionary,
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
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
                    },
                    disabled: false,
                    data: {
                        bar: {},
                    },
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: {
                        type: "object",
                        properties: {
                            bat: {
                                type: "string",
                            },
                        },
                    },
                    disabled: false,
                    data: {},
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "object",
                                properties: {},
                            },
                        },
                    },
                    data: {
                        bar: {},
                    },
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    bar: [],
                                },
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary,
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("li")).toHaveLength(0);
    });
    test("should show breadcrumbs if the navigation location is not at the root level", () => {
        const schemaDictionary: { [key: string]: any } = {
            foo: {
                id: "foo",
                type: "object",
                properties: {
                    bar: {
                        type: "object",
                        properties: {},
                    },
                },
            },
        };
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    abc: {
                        schemaId: "foo",
                        data: {
                            bar: {},
                        },
                    },
                },
                "abc",
            ],
            schemaDictionary,
        });

        const formInstance: any = mount(
            <ModularForm {...formProps} messageSystem={fastMessageSystem} />
        );

        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
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
                    },
                    disabled: false,
                    data: {
                        bar: {},
                    },
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: {
                        type: "object",
                        properties: {
                            bat: {
                                type: "string",
                            },
                        },
                    },
                    disabled: false,
                    data: {},
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "abc",
        ];

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "bar",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "object",
                                properties: {},
                            },
                        },
                    },
                    data: {
                        bar: {},
                    },
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    bar: [],
                                },
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary,
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "bar",
        });

        expect(formInstance.find("li")).toHaveLength(2);
    });
    test("should show a custom form control when encountering a formControlId in the schema instead of the default control if one has been passed", () => {
        const data: any = {
            bar: true,
        };
        const schema: any = {
            id: "foo",
            formControlId: "foobar",
            type: "object",
            properties: {
                bar: {
                    type: "boolean",
                },
            },
        };
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    abc: {
                        schemaId: "foo",
                        data,
                    },
                },
                "abc",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });

        const formInstance: any = mount(
            <ModularForm
                {...formProps}
                messageSystem={fastMessageSystem}
                controls={[
                    new StandardControlPlugin({
                        id: "foobar",
                        control: (config: any): React.ReactNode => {
                            return <div className="test" />;
                        },
                    }),
                ]}
            />
        );

        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.boolean,
                    items: [],
                },
            },
            "abc",
        ];

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("CheckboxControl")).toHaveLength(0);
        expect(formInstance.find(".test")).toHaveLength(1);
    });
    test("should show a custom form control as a type instead of the default control if one has been passed", () => {
        const data: any = {
            bar: true,
        };
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "boolean",
                },
            },
        };
        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
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
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: schema.properties.bar,
                    disabled: false,
                    data: data.bar,
                    text: "bat",
                    type: DataType.boolean,
                    items: [],
                },
            },
            "abc",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });
        const formInstance: any = mount(
            <ModularForm
                {...formProps}
                messageSystem={fastMessageSystem}
                controls={[
                    new StandardControlPlugin({
                        type: ControlType.checkbox,
                        control: (config: any): React.ReactNode => {
                            return <div className="test" />;
                        },
                    }),
                ]}
            />
        );

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("CheckboxControl")).toHaveLength(0);
        expect(formInstance.find(".test")).toHaveLength(1);
    });
    test("should show a custom form control as all types instead of the default controls if one has been passed", () => {
        const schemaDictionary: { [key: string]: any } = {
            foo: {
                id: "foo",
                type: "object",
                properties: {
                    bar: {
                        type: "boolean",
                    },
                },
            },
        };
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            bar: true,
                        },
                    },
                },
                "",
            ],
            schemaDictionary,
        });

        const formInstance: any = mount(
            <ModularForm
                {...formProps}
                messageSystem={fastMessageSystem}
                controls={[
                    new StandardControlPlugin({
                        control: (config: any): React.ReactNode => {
                            return <div className="test" />;
                        },
                    }),
                ]}
            />
        );

        const navigation: NavigationConfig = [
            {
                abc: {
                    self: "abc",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                    disabled: false,
                    data: {
                        bar: true,
                    },
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "abc",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema: {
                        type: "boolean",
                    },
                    disabled: false,
                    data: true,
                    text: "bat",
                    type: DataType.boolean,
                    items: [],
                },
            },
            "abc",
        ];

        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                    data: {
                        bar: true,
                    },
                    dataDictionary: [
                        {
                            "": {
                                schemaId: "foo",
                                data: {
                                    bar: true,
                                },
                            },
                        },
                        "",
                    ],
                    navigation,
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    schemaDictionary,
                    historyLimit: 30,
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("SectionControl")).toHaveLength(0);
        expect(formInstance.find(".test")).toHaveLength(1);
    });
});
