import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { BareForm, Form } from "./";
import { FormProps } from "./form.props";
import { MessageSystemRegistry } from "../message-system-registry";

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
import { DataType } from "../data-utilities/types";
import { Register } from "../message-system-registry/message-system-registry.props";
import {
    InitializeMessageOutgoing,
    MessageSystemType,
} from "../message-system/message-system.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
(window as any).Worker = true; // this enables the use of the registry

const formProps: FormProps = {
    messageSystem: void 0,
    messageSystemRegistry: void 0,
};

describe("Form", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Form {...formProps} />);
        }).not.toThrow();
    });
    test("should register the component with a message system", () => {
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem: void 0,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                    },
                },
            }
        );

        /* tslint:disable-next-line */
        expect(fastMessageSystemRegistry["register"].size).toEqual(0);

        mount(<Form {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />);

        /* tslint:disable-next-line */
        expect(fastMessageSystemRegistry["register"].size).toEqual(1);
    });
    test("should deregister the component with the message system on unmount", () => {
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem: void 0,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                    },
                },
            }
        );

        const formInstance: any = mount(
            <Form {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        formInstance.unmount();

        /* tslint:disable-next-line */
        expect(fastMessageSystemRegistry["register"].size).toEqual(0);
    });
    test("should fire an event to initialize the message system", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "string",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <Form {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        expect(onMessageCallbackfn).not.toHaveBeenCalled();
        expect(postMessageCallbackfn).toHaveBeenCalledTimes(1);
    });
    test("should show a section link if the schema contains a property which is an object", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
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
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    data: {
                        bar: {},
                    },
                    navigation: [
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
                                data: {},
                                text: "bat",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("SectionLinkControl")).toHaveLength(1);
    });
    test("should show a checkbox if the schema contains a property which is a boolean", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
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
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    navigation: [
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
                                    type: "boolean",
                                },
                                data: true,
                                text: "bat",
                                type: DataType.boolean,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("CheckboxControl")).toHaveLength(1);
    });
    test("should show a textarea if the schema contains a property which is a string", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {
                                bar: "hello world",
                            },
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "string",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "string",
                            },
                        },
                    },
                    data: {
                        bar: "hello world",
                    },
                    navigation: [
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
                                            type: "string",
                                        },
                                    },
                                },
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
                                    type: "string",
                                },
                                data: true,
                                text: "bat",
                                type: DataType.string,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("TextareaControl")).toHaveLength(1);
    });
    test("should show a numberfield if the schema contains a property which is a number", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {
                                bar: 42,
                            },
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                            },
                        },
                    },
                    data: {
                        bar: 42,
                    },
                    navigation: [
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
                                            type: "number",
                                        },
                                    },
                                },
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
                                    type: "number",
                                },
                                data: true,
                                text: "bat",
                                type: DataType.number,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("NumberFieldControl")).toHaveLength(1);
    });
    test("should show a select if the schema contains a property which is an enum", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {
                                bar: 42,
                            },
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                                enum: [42, 24],
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                                enum: [42, 24],
                            },
                        },
                    },
                    data: {
                        bar: 42,
                    },
                    navigation: [
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
                                            type: "number",
                                            enum: [42, 24],
                                        },
                                    },
                                },
                                data: {
                                    bar: 42,
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
                                    type: "number",
                                    enum: [42, 24],
                                },
                                data: true,
                                text: "bat",
                                type: DataType.number,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("SelectControl")).toHaveLength(1);
    });
    test("should show a display if the schema contains a property which is a const", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {
                                bar: 42,
                                const: 42,
                            },
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "number",
                            },
                        },
                    },
                    data: {
                        bar: 42,
                    },
                    navigation: [
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
                                            type: "number",
                                            const: 42,
                                        },
                                    },
                                },
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
                                    type: "number",
                                    const: 42,
                                },
                                data: true,
                                text: "bat",
                                type: DataType.number,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("DisplayControl")).toHaveLength(1);
    });
    test("should show a button if the schema contains a property which is null", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {
                                bar: null,
                            },
                        },
                    },
                    "",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "null",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "null",
                            },
                        },
                    },
                    data: {
                        bar: 42,
                    },
                    navigation: [
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
                                            type: "null",
                                        },
                                    },
                                },
                                data: {
                                    bar: null,
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
                                    type: "null",
                                },
                                data: null,
                                text: "bat",
                                type: DataType.number,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("ButtonControl")).toHaveLength(1);
    });
    test("should show an array if the schema contains a property which is an array", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
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
                schemas: {
                    foo: {
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
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
                    schema: {
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
                    },
                    data: {
                        bar: [],
                    },
                    navigation: [
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
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                                data: {
                                    bar: [],
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
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                                data: [],
                                text: "bat",
                                type: DataType.number,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("ArrayControl")).toHaveLength(1);
    });
    test("should not show breadcrumbs if the navigation location is at the root level", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
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
                schemas: {
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
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    navigation: [
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
                                            properties: {},
                                        },
                                    },
                                },
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
                                    properties: {},
                                },
                                data: {},
                                text: "bat",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "abc",
        });

        expect(formInstance.find("li")).toHaveLength(0);
    });
    test("should show breadcrumbs if the navigation location is not at the root level", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
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
                schemas: {
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
                },
            }
        );

        const formInstance: any = mount(
            <BareForm {...formProps} messageSystemRegistry={fastMessageSystemRegistry} />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "bar",
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
                    navigation: [
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
                                            properties: {},
                                        },
                                    },
                                },
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
                                    properties: {},
                                },
                                data: {},
                                text: "bat",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "abc",
                    ],
                } as InitializeMessageOutgoing,
            } as any);
        });

        formInstance.setState({
            activeNavigationId: "bar",
        });

        expect(formInstance.find("li")).toHaveLength(2);
    });
    test("should show a custom form control when encountering a formControlId in the schema instead of the default control if one has been passed", () => {
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        abc: {
                            schemaId: "foo",
                            data: {
                                bar: true,
                            },
                        },
                    },
                    "abc",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        formControlId: "foobar",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm
                {...formProps}
                messageSystemRegistry={fastMessageSystemRegistry}
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

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    navigation: [
                        {
                            abc: {
                                self: "abc",
                                parent: null,
                                relativeDataLocation: "",
                                schemaLocation: "",
                                schema: {
                                    id: "foo",
                                    formControlId: "foobar",
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
                                data: true,
                                text: "bat",
                                type: DataType.boolean,
                                items: [],
                            },
                        },
                        "abc",
                    ],
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
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        abc: {
                            schemaId: "foo",
                            data: {
                                bar: true,
                            },
                        },
                    },
                    "abc",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm
                {...formProps}
                messageSystemRegistry={fastMessageSystemRegistry}
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

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    navigation: [
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
                                data: true,
                                text: "bat",
                                type: DataType.boolean,
                                items: [],
                            },
                        },
                        "abc",
                    ],
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
        const onMessageCallbackfn: any = jest.fn();
        const postMessageCallbackfn: any = jest.fn();
        const messageSystem: any = {
            onmessage: onMessageCallbackfn,
            postMessage: postMessageCallbackfn,
        };
        const fastMessageSystemRegistry: MessageSystemRegistry = new MessageSystemRegistry(
            {
                messageSystem,
                data: [
                    {
                        abc: {
                            schemaId: "foo",
                            data: {
                                bar: true,
                            },
                        },
                    },
                    "abc",
                ],
                schemas: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            bar: {
                                type: "boolean",
                            },
                        },
                    },
                },
            }
        );

        const formInstance: any = mount(
            <BareForm
                {...formProps}
                messageSystemRegistry={fastMessageSystemRegistry}
                controls={[
                    new StandardControlPlugin({
                        control: (config: any): React.ReactNode => {
                            return <div className="test" />;
                        },
                    }),
                ]}
            />
        );

        /* tslint:disable-next-line */
        fastMessageSystemRegistry["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeId: "abc",
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
                    navigation: [
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
                                data: true,
                                text: "bat",
                                type: DataType.boolean,
                                items: [],
                            },
                        },
                        "abc",
                    ],
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
