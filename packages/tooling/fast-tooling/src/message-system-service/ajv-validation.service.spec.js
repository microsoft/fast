import chai, { expect } from "chai";
import spies from "chai-spies";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
    SchemaSetValidationAction,
} from "../message-system";
import { DataType } from "../data-utilities/types";
import { AjvMapper, ajvValidationId } from "./ajv-validation.service";
chai.use(spies);
/**
 * These tests rely on some async functionality.
 * They are therefore not included with the rest of the coverage
 * and should be run only locally when making changes to the AjvMapper service.
 *
 * TODO: enable these tests in #4603
 */
/* eslint-disable @typescript-eslint/no-empty-function */
xdescribe("AjvMapper", () => {
    it("should not throw", () => {
        expect(() => {
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: undefined,
                        },
                    },
                    "foo",
                ],
                schemaDictionary: {
                    foo: {},
                },
            });
            new AjvMapper({
                messageSystem,
            });
        }).not.to.throw();
    });
    it("should not throw if the message system is undefined", () => {
        expect(() => {
            new AjvMapper({
                messageSystem: undefined,
            });
        }).not.to.throw();
    });
    it("should register to the message system", () => {
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: undefined,
                    },
                },
                "foo",
            ],
            schemaDictionary: {
                foo: {},
            },
        });
        expect(messageSystem["register"].size).to.equal(0);
        new AjvMapper({
            messageSystem,
        });
        expect(messageSystem["register"].size).to.equal(1);
    });
    it("should deregister from the message system", () => {
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    foo: {
                        schemaId: "foo",
                        data: undefined,
                    },
                },
                "foo",
            ],
            schemaDictionary: {
                foo: {},
            },
        });
        expect(messageSystem["register"].size).to.equal(0);
        const ajvMapper = new AjvMapper({
            messageSystem,
        });
        expect(messageSystem["register"].size).to.equal(1);
        ajvMapper.destroy();
        expect(messageSystem["register"].size).to.equal(0);
    });
    it("should call the message callback if an initialize message has been sent", () => {
        const schema = {
            id: "foo",
        };
        const data = undefined;
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    foo: {
                        schemaId: schema.id,
                        data: undefined,
                    },
                },
                "foo",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });
        const ajvMapper = new AjvMapper({
            messageSystem,
        });
        const navigation = [
            {
                foo: {
                    self: "foo",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "foo",
                    type: DataType.object,
                    items: [],
                },
            },
            "foo",
        ];
        messageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "foo",
                    activeNavigationConfigId: "foo",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            foo: {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "foo",
                    ],
                    navigationDictionary: [
                        {
                            foo: navigation,
                        },
                        "foo",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        expect(ajvMapper["validation"]["foo"]).to.deep.equal([]);
    });
    it("should convert ajv errors to the error format expected by the message system", () => {
        const schema = {
            $schema: "http://json-schema.org/schema#",
            id: "foo",
            type: "string",
        };
        const data = 42;
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    foo: {
                        schemaId: schema.id,
                        data: undefined,
                    },
                },
                "foo",
            ],
            schemaDictionary: {
                foo: schema,
            },
        });
        const ajvMapper = new AjvMapper({
            messageSystem,
        });
        const navigation = [
            {
                foo: {
                    self: "foo",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "foo",
                    type: DataType.object,
                    items: [],
                },
            },
            "foo",
        ];
        messageSystem["register"].forEach(registeredItem => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "foo",
                    activeNavigationConfigId: "foo",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            foo: {
                                schemaId: "foo",
                                data,
                            },
                        },
                        "foo",
                    ],
                    navigationDictionary: [
                        {
                            foo: navigation,
                        },
                        "foo",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                    historyLimit: 30,
                },
            });
        });
        expect(ajvMapper["validation"]["foo"]).to.deep.equal([
            {
                dataLocation: "",
                invalidMessage: "should be string",
            },
        ]);
    });
    describe("should call the message callback if a data message has been sent", () => {
        const schema = {
            $schema: "http://json-schema.org/schema#",
            id: "foo",
            type: "string",
        };
        const data = 42;
        const dataDictionary = [
            {
                foo: {
                    schemaId: schema.id,
                    data,
                },
            },
            "foo",
        ];
        const navigation = [
            {
                foo: {
                    self: "foo",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    data,
                    text: "foo",
                    type: DataType.object,
                    items: [],
                },
            },
            "foo",
        ];
        const navigationDictionary = [
            {
                foo: navigation,
            },
            "foo",
        ];
        it("with action type 'add'", () => {
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary,
                schemaDictionary: {
                    foo: schema,
                },
            });
            const ajvMapper = new AjvMapper({
                messageSystem,
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.initialize,
                        activeDictionaryId: "foo",
                        activeNavigationConfigId: "foo",
                        schema,
                        data,
                        dataDictionary,
                        navigationDictionary,
                        navigation,
                        schemaDictionary: {
                            foo: schema,
                        },
                        historyLimit: 30,
                    },
                });
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    },
                });
            });
            expect(ajvMapper["validation"]["foo"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        it("with action type 'addLinkedData'", () => {
            const schema2 = {
                $schema: "http://json-schema.org/schema#",
                id: "bar",
                type: "boolean",
            };
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary,
                schemaDictionary: {
                    foo: schema,
                    bar: schema2,
                },
            });
            const ajvMapper = new AjvMapper({
                messageSystem,
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.initialize,
                        activeDictionaryId: "foo",
                        activeNavigationConfigId: "foo",
                        schema,
                        data,
                        dataDictionary,
                        navigationDictionary,
                        navigation,
                        schemaDictionary: {
                            foo: schema,
                        },
                        historyLimit: 30,
                    },
                });
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        data: "foo",
                        dictionaryId: "bar",
                        linkedDataIds: [],
                        dataDictionary,
                        navigation: [
                            {
                                bar: {
                                    self: "bar",
                                    parent: "foo",
                                    relativeDataLocation: "",
                                    schemaLocation: "",
                                    schema: schema2,
                                    disabled: false,
                                    data: "foo",
                                    text: "",
                                    type: DataType.boolean,
                                    items: [],
                                },
                            },
                            "bar",
                        ],
                        navigationDictionary,
                    },
                });
            });
            expect(ajvMapper["validation"]["bar"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be boolean",
                },
            ]);
        });
        it("with action type 'duplicate'", () => {
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary,
                schemaDictionary: {
                    foo: schema,
                },
            });
            const ajvMapper = new AjvMapper({
                messageSystem,
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.initialize,
                        activeDictionaryId: "foo",
                        activeNavigationConfigId: "foo",
                        schema,
                        data,
                        dataDictionary,
                        navigationDictionary,
                        navigation,
                        schemaDictionary: {
                            foo: schema,
                        },
                        historyLimit: 30,
                    },
                });
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.duplicate,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    },
                });
            });
            expect(ajvMapper["validation"]["foo"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        it("with action type 'update'", () => {
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary,
                schemaDictionary: {
                    foo: schema,
                },
            });
            const ajvMapper = new AjvMapper({
                messageSystem,
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.initialize,
                        activeDictionaryId: "foo",
                        activeNavigationConfigId: "foo",
                        schema,
                        data,
                        dataDictionary,
                        navigationDictionary,
                        navigation,
                        schemaDictionary: {
                            foo: schema,
                        },
                        historyLimit: 30,
                    },
                });
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    },
                });
            });
            expect(ajvMapper["validation"]["foo"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        it("without action type 'removeLinkedData'", () => {
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary,
                schemaDictionary: {
                    foo: schema,
                },
            });
            const ajvMapper = new AjvMapper({
                messageSystem,
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.initialize,
                        activeDictionaryId: "foo",
                        activeNavigationConfigId: "foo",
                        schema,
                        data,
                        dataDictionary,
                        navigationDictionary,
                        navigation,
                        schemaDictionary: {
                            foo: schema,
                        },
                        historyLimit: 30,
                    },
                });
            });
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    },
                });
            });
            expect(ajvMapper["validation"]["foo"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
    });
    describe("should call the message callback if a custom validation message has been sent", () => {
        const containsValidSchema = [
            {
                $schema: "http://json-schema.org/schema#",
                id: "bar",
                type: "string",
            },
            {
                $schema: "http://json-schema.org/schema#",
                id: "foo",
                type: "number",
            },
        ];
        const containsInvalidSchema = [
            {
                $schema: "http://json-schema.org/schema#",
                id: "bar",
                type: "string",
            },
            {
                $schema: "http://json-schema.org/schema#",
                id: "foo",
                type: "boolean",
            },
        ];
        const data = 42;
        it("with action type 'request' when there is a valid schema in the schema set", () => {
            const callback = chai.spy(() => {});
            const postMessageCallback = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const requestMessage = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.request,
                id,
                schemas: containsValidSchema,
                data,
            };
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: requestMessage,
                });
            });
            expect(postMessageCallback).to.have.been.called.exactly(1);
            expect(postMessageCallback).to.have.been.called.with({
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: 1,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        });
        it("with action type 'request' when there is no valid schema in the schema set", () => {
            const callback = chai.spy(() => {});
            const postMessageCallback = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const requestMessage = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.request,
                id,
                schemas: containsInvalidSchema,
                data,
            };
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: requestMessage,
                });
            });
            expect(postMessageCallback).to.have.been.called.exactly(1);
            expect(postMessageCallback).to.have.been.called.with({
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: -1,
                options: {
                    originatorId: ajvValidationId,
                },
            });
        });
        it("with action type that is not 'request'", () => {
            const callback = chai.spy(() => {});
            const postMessageCallback = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const responseMessage = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: -1,
            };
            messageSystem["register"].forEach(registeredItem => {
                registeredItem.onMessage({
                    data: responseMessage,
                });
            });
            expect(postMessageCallback).to.have.been.called.exactly(0);
        });
    });
});
