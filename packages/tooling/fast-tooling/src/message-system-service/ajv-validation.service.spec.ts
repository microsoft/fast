import chai, { expect } from "chai";
import spies from "chai-spies";
import {
    AddLinkedDataDataMessageOutgoing,
    DataDictionary,
    DuplicateDataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
    NavigationConfig,
    NavigationConfigDictionary,
    Register,
    RemoveLinkedDataDataMessageOutgoing,
    SchemaSetValidationAction,
    SchemaSetValidationMessageRequest,
    SchemaSetValidationMessageResponse,
    UpdateDataMessageOutgoing,
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

        const ajvMapper: AjvMapper = new AjvMapper({
            messageSystem,
        });

        expect(messageSystem["register"].size).to.equal(1);

        ajvMapper.destroy();

        expect(messageSystem["register"].size).to.equal(0);
    });
    it("should call the message callback if an initialize message has been sent", () => {
        const schema: any = {
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

        const ajvMapper: AjvMapper = new AjvMapper({
            messageSystem,
        });

        const navigation: NavigationConfig = [
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

        messageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        expect(ajvMapper["validation"]["foo"]).to.deep.equal([]);
    });
    it("should convert ajv errors to the error format expected by the message system", () => {
        const schema: any = {
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

        const ajvMapper: AjvMapper = new AjvMapper({
            messageSystem,
        });

        const navigation: NavigationConfig = [
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

        messageSystem["register"].forEach((registeredItem: Register) => {
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        expect(ajvMapper["validation"]["foo"]).to.deep.equal([
            {
                dataLocation: "",
                invalidMessage: "should be string",
            },
        ]);
    });
    describe("should call the message callback if a data message has been sent", () => {
        const schema: any = {
            $schema: "http://json-schema.org/schema#",
            id: "foo",
            type: "string",
        };
        const data = 42;
        const dataDictionary: DataDictionary<unknown> = [
            {
                foo: {
                    schemaId: schema.id,
                    data,
                },
            },
            "foo",
        ];
        const navigation: NavigationConfig = [
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
        const navigationDictionary: NavigationConfigDictionary = [
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
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });

            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    } as UpdateDataMessageOutgoing,
                } as any);
            });

            expect(ajvMapper["validation"]["foo"]).to.deep.equal([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        it("with action type 'addLinkedData'", () => {
            const schema2: any = {
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
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });

            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as AddLinkedDataDataMessageOutgoing,
                } as any);
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
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });

            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.duplicate,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    } as DuplicateDataMessageOutgoing,
                } as any);
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
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });

            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    } as UpdateDataMessageOutgoing,
                } as any);
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
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });

            messageSystem["register"].forEach((registeredItem: Register) => {
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        data,
                        dataDictionary,
                        navigation,
                        navigationDictionary,
                    } as RemoveLinkedDataDataMessageOutgoing,
                } as any);
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
        const containsValidSchema: any[] = [
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
        const containsInvalidSchema: any[] = [
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
            const callback: any = chai.spy(() => {});
            const postMessageCallback: any = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id: string = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const requestMessage: SchemaSetValidationMessageRequest = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.request,
                id,
                schemas: containsValidSchema,
                data,
            };

            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: requestMessage,
                } as any);
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
            const callback: any = chai.spy(() => {});
            const postMessageCallback: any = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id: string = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const requestMessage: SchemaSetValidationMessageRequest = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.request,
                id,
                schemas: containsInvalidSchema,
                data,
            };

            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: requestMessage,
                } as any);
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
            const callback: any = chai.spy(() => {});
            const postMessageCallback: any = chai.spy(() => {});
            const messageSystem = new MessageSystem({
                webWorker: "",
                dataDictionary: null,
                schemaDictionary: null,
            });
            messageSystem.postMessage = postMessageCallback;
            new AjvMapper({
                messageSystem,
            });
            const id: string = "foobarbat";
            messageSystem.add({
                onMessage: callback,
            });
            const responseMessage: SchemaSetValidationMessageResponse = {
                type: MessageSystemType.custom,
                action: SchemaSetValidationAction.response,
                id,
                index: -1,
            };

            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: responseMessage,
                } as any);
            });

            expect(postMessageCallback).to.have.been.called.exactly(0);
        });
    });
});
