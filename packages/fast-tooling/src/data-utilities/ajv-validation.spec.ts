import { AjvMapper } from "./ajv-validation";
import {
    AddLinkedDataDataMessageOutgoing,
    DataDictionary,
    DataMessageOutgoing,
    DuplicateDataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
    NavigationConfig,
    NavigationConfigDictionary,
    Register,
    RemoveLinkedDataDataMessageOutgoing,
    UpdateDataMessageOutgoing,
} from "../message-system";
import { DataType } from "./types";

describe("AjvMapper", () => {
    test("should not throw", () => {
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

            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem,
            });
        }).not.toThrow();
    });
    test("should not throw if the message system is undefined", () => {
        expect(() => {
            const ajvMapper: AjvMapper = new AjvMapper({
                messageSystem: undefined,
            });
        }).not.toThrow();
    });
    test("should register to the message system", () => {
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

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(0);

        const ajvMapper: AjvMapper = new AjvMapper({
            messageSystem,
        });

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(1);
    });
    test("should deregister from the message system", () => {
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

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(0);

        const ajvMapper: AjvMapper = new AjvMapper({
            messageSystem,
        });

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(1);

        ajvMapper.destroy();

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(0);
    });
    test("should call the message callback if an initialize message has been sent", () => {
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

        /* tslint:disable-next-line */
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        /* tslint:disable-next-line */
        expect(ajvMapper["validation"]["foo"]).toEqual([]);
    });
    test("should convert ajv errors to the error format expected by the message system", () => {
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

        /* tslint:disable-next-line */
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
                } as InitializeMessageOutgoing,
            } as any);
        });

        /* tslint:disable-next-line */
        expect(ajvMapper["validation"]["foo"]).toEqual([
            {
                dataLocation: "",
                invalidMessage: "should be string",
            },
        ]);
    });
    describe("should call the message callback if an data message has been sent", () => {
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

        test("with action type 'add'", () => {
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

            /* tslint:disable-next-line */
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            /* tslint:disable-next-line */
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

            /* tslint:disable-next-line */
            expect(ajvMapper["validation"]["foo"]).toEqual([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("with action type 'addLinkedData'", () => {
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

            /* tslint:disable-next-line */
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            /* tslint:disable-next-line */
            messageSystem["register"].forEach((registeredItem: Register) => {
                registeredItem.onMessage({
                    data: {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        data: "foo",
                        dictionaryId: "bar",
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

            /* tslint:disable-next-line */
            expect(ajvMapper["validation"]["bar"]).toEqual([
                {
                    dataLocation: "",
                    invalidMessage: "should be boolean",
                },
            ]);
        });
        test("with action type 'duplicate'", () => {
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

            /* tslint:disable-next-line */
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            /* tslint:disable-next-line */
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

            /* tslint:disable-next-line */
            expect(ajvMapper["validation"]["foo"]).toEqual([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("with action type 'update'", () => {
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

            /* tslint:disable-next-line */
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            /* tslint:disable-next-line */
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

            /* tslint:disable-next-line */
            expect(ajvMapper["validation"]["foo"]).toEqual([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
        test("without action type 'removeLinkedData'", () => {
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

            /* tslint:disable-next-line */
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
                    } as InitializeMessageOutgoing,
                } as any);
            });
            /* tslint:disable-next-line */
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

            /* tslint:disable-next-line */
            expect(ajvMapper["validation"]["foo"]).toEqual([
                {
                    dataLocation: "",
                    invalidMessage: "should be string",
                },
            ]);
        });
    });
});
