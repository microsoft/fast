import { DataType } from "../data-utilities/types";
import { linkedDataSchema } from "../schemas";
import {
    AddDataMessageOutgoing,
    AddLinkedDataDataMessageOutgoing,
    DuplicateDataMessageOutgoing,
    GetDataDictionaryMessageIncoming,
    GetDataDictionaryMessageOutgoing,
    GetHistoryMessageIncoming,
    GetHistoryMessageOutgoing,
    GetNavigationDictionaryMessageIncoming,
    GetNavigationDictionaryMessageOutgoing,
    GetNavigationMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemValidationTypeAction,
    NavigationMessageOutgoing,
    RemoveDataMessageOutgoing,
    UpdateActiveIdDataDictionaryMessageIncoming,
    UpdateActiveIdDataDictionaryMessageOutgoing,
    UpdateActiveIdNavigationDictionaryMessageIncoming,
    UpdateActiveIdNavigationDictionaryMessageOutgoing,
    UpdateDataMessageOutgoing,
    ValidationMessageIncoming,
} from "./message-system.utilities.props";
import { MessageSystemType } from "./types";
import { getMessage } from "./message-system.utilities";
import { Data, DataDictionary, LinkedData } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { getNavigationDictionary } from "./navigation";

describe("getMessage", () => {
    describe("history", () => {
        test("should return messages sent to get the history", () => {
            const getHistory: GetHistoryMessageIncoming = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };
            expect(getMessage(getHistory)).toEqual({
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
                history: {
                    items: [],
                    limit: 30,
                },
            } as GetHistoryMessageOutgoing);
        });
        test("should update the history when a new message has been sent", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            }) as InitializeMessageOutgoing;

            const getHistory: GetHistoryMessageIncoming = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };

            expect(
                (getMessage(getHistory) as GetHistoryMessageOutgoing).history.items.length
            ).toEqual(1);
        });
        test("should remove the first item in the array if another item is added that would be higher than the limit", () => {
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            function dataFactory(count): DataDictionary<unknown> {
                return [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                foo: "bar" + count,
                            },
                        },
                    },
                    "data",
                ];
            }
            for (let i = 0, limit = 50; i < limit; i++) {
                getMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: dataFactory(i),
                    schemaDictionary,
                }) as InitializeMessageOutgoing;
            }

            const getHistory: GetHistoryMessageIncoming = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };

            expect(
                (getMessage(getHistory) as GetHistoryMessageOutgoing).history.items.length
            ).toEqual(30);
            expect(
                ((getMessage(getHistory) as GetHistoryMessageOutgoing).history
                    .items[29] as any).data.foo
            ).toEqual("bar49");
        });
    });
    describe("initialize", () => {
        test("should return messages sent with initial values provided", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            const message: InitializeMessageOutgoing = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            }) as InitializeMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.initialize);
            expect(message.data).toEqual(dataBlob[0][dataBlob[1]].data);
            expect(message.schema).toEqual(schemaDictionary["foo"]);
            expect(typeof message.navigation).toEqual("object");
        });
        test("should return messages sent with initial values provided using the deprecated data property", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            const message: InitializeMessageOutgoing = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            }) as InitializeMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.initialize);
            expect(message.data).toEqual(dataBlob[0][dataBlob[1]].data);
            expect(message.schema).toEqual(schemaDictionary["foo"]);
            expect(typeof message.navigation).toEqual("object");
        });
        test("should return messages sent with a dictionary id provided", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                    data2: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            const message: InitializeMessageOutgoing = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
                dictionaryId: "data2",
            }) as InitializeMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.initialize);
            expect(message.activeDictionaryId).toEqual("data2");
        });
    });
    describe("data", () => {
        test("should return a data blob with duplicated values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                foo: "bar",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: DuplicateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: "foo",
            }) as DuplicateDataMessageOutgoing;

            expect(message.data).toEqual({ foo: ["bar", "bar"] });
        });
        test("should return a data blob without removed values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                foo: "bar",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: RemoveDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                dataLocation: "foo",
            }) as RemoveDataMessageOutgoing;

            expect(message.data).toEqual({});
        });
        test("should return a data blob with added values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: AddDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                dataLocation: "hello",
                data: "world",
                dataType: DataType.object,
            }) as AddDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "world" });
        });
        test("should return a data blob with updated values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: UpdateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: "hello",
                data: "venus",
            }) as UpdateDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "venus" });
        });
        test("should return a data blob with updated values when the data is at the root", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: UpdateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: "",
                data: { hello: "venus" },
            }) as UpdateDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "venus" });
        });
        test("should return a data blob with updated values when a dictionaryId has been specified", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {},
                        },
                        bar: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "foo",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const message: UpdateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dictionaryId: "bar",
                dataLocation: "",
                data: { hello: "venus" },
            }) as UpdateDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "venus" });
            expect(message.dataDictionary).toEqual([
                {
                    foo: {
                        schemaId: "foo",
                        data: {},
                    },
                    bar: {
                        schemaId: "foo",
                        data: {
                            hello: "venus",
                        },
                    },
                },
                "foo",
            ]);
        });
        test("should add linkedData to the data and the data dictionary", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect(Array.isArray((message.data as any).linkedData)).toEqual(true);
            expect((message.data as any).linkedData.length).toEqual(1);

            const id: string = (message.data as any).linkedData[0].id;
            const dictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            }) as GetDataDictionaryMessageOutgoing;

            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.toEqual(-1);
            expect(dictionary.dataDictionary[0][id].data).toEqual(linkedData[0].data);
            expect(message.linkedDataIds).toEqual([{ id }]);
        });
        test("should add linkedData to the data and the data dictionary when specifying a dictionary ID", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                        abc: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                dictionaryId: "abc",
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect(
                Array.isArray((message.dataDictionary[0].abc.data as any).linkedData)
            ).toEqual(true);
            expect((message.dataDictionary[0].abc.data as any).linkedData.length).toEqual(
                1
            );

            const id: string = (message.dataDictionary[0].abc.data as any).linkedData[0]
                .id;
            const dictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            }) as GetDataDictionaryMessageOutgoing;

            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.toEqual(-1);
            expect(dictionary.dataDictionary[0][id].data).toEqual(linkedData[0].data);
            expect((dictionary.dataDictionary[0].abc.data as any).linkedData).toEqual([
                { id },
            ]);
        });
        test("should add linkedData to an existing array of linkedData items", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "foo",
                            data: {
                                test: "hello world",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect(Array.isArray((message.data as any).linkedData)).toEqual(true);
            expect((message.data as any).linkedData.length).toEqual(2);

            const id: string = (message.data as any).linkedData[1].id;
            const dictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            }) as GetDataDictionaryMessageOutgoing;

            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.toEqual(-1);
            expect(dictionary.dataDictionary[0][id].data).toEqual(linkedData[0].data);
        });
        test("should add linkedData to a specific index of an existing array of linkedData items", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "foo",
                            data: {
                                test: "hello world",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
                index: 0,
            }) as AddLinkedDataDataMessageOutgoing;

            expect(Array.isArray((message.data as any).linkedData)).toEqual(true);
            expect((message.data as any).linkedData.length).toEqual(2);

            const id: string = (message.data as any).linkedData[0].id;
            const dictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            }) as GetDataDictionaryMessageOutgoing;

            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.toEqual(-1);
            expect(dictionary.dataDictionary[0][id].data).toEqual(linkedData[0].data);
        });
        test("should add nested linked data to the data dictionary", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                    linkedData: [
                        {
                            schemaId: "foo",
                            data: {
                                hello: "pluto",
                            },
                        },
                    ],
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect(Array.isArray((message.data as any).linkedData)).toEqual(true);
            expect((message.data as any).linkedData.length).toEqual(1);

            const id: string = (message.data as any).linkedData[0].id;
            const nestedId: string = (message.dataDictionary[0][id].data as any)
                .linkedData[0].id;
            const dictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            }) as GetDataDictionaryMessageOutgoing;

            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.toEqual(-1);
            expect(dictionary.dataDictionary[0]).toEqual({
                data: {
                    data: {
                        linkedData: [
                            {
                                id: "fast5",
                            },
                        ],
                    },
                    schemaId: "foo",
                },
                fast5: {
                    data: {
                        hello: "world",
                        linkedData: [
                            {
                                id: "fast6",
                            },
                        ],
                    },
                    parent: {
                        dataLocation: "linkedData",
                        id: "data",
                    },
                    schemaId: "foo",
                },
                fast6: {
                    data: {
                        hello: "pluto",
                    },
                    parent: {
                        dataLocation: "linkedData",
                        id: "fast5",
                    },
                    schemaId: "foo",
                },
            });
            expect(message.linkedDataIds).toEqual([{ id: nestedId }, { id }]);
        });
        test("should remove linkedData from the data and the data dictionary", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "data2",
                                    },
                                ],
                            },
                        },
                        data2: {
                            schemaId: "foo",
                            data: {
                                hello: "world",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect((message.data as any).linkedData).toEqual([]);
        });
        test("should remove linkedData from the data and the data dictionary when specifying a dictionary ID", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data1: {
                            schemaId: "foo",
                            data: {
                                hello: "world",
                            },
                        },
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "data2",
                                    },
                                ],
                            },
                        },
                        data2: {
                            schemaId: "foo",
                            data: {
                                hello: "world",
                            },
                        },
                    },
                    "data1",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dictionaryId: "data",
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect((message.dataDictionary[0].data.data as any).linkedData).toEqual([]);
        });
        test("should remove linkedData and linked data items from the data and the data dictionary", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "data2",
                                    },
                                ],
                            },
                        },
                        data2: {
                            parent: {
                                dataLocation: "linkedData",
                                id: "data",
                            },
                            schemaId: "foo",
                            data: {
                                hello: "world",
                                linkedData: [
                                    {
                                        id: "data3",
                                    },
                                ],
                            },
                        },
                        data3: {
                            parent: {
                                dataLocation: "linkedData",
                                id: "data2",
                            },
                            schemaId: "foo",
                            data: {
                                foo: "bar",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: {
                        id: "foo",
                        type: "object",
                        properties: {
                            linkedData: linkedDataSchema,
                        },
                    },
                },
            });
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect((message.data as any).linkedData).toEqual([]);
            expect(message.dataDictionary).toEqual([
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            linkedData: [],
                        },
                    },
                },
                "data",
            ]);
            expect(message.linkedDataIds).toEqual(["data2", "data3"]);
        });
        test("should reorder linkedData in the exist array of linkedData items", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                linkedData: [
                                    {
                                        id: "foo",
                                    },
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "foo",
                            data: {
                                test: "hello world",
                            },
                        },
                        bar: {
                            schemaId: "foo",
                            data: {
                                test: "hello world",
                            },
                        },
                    },
                    "data",
                ],
                schemaDictionary: {
                    foo: { id: "foo" },
                },
            });
            const linkedData: LinkedData[] = [
                {
                    id: "bar",
                },
                {
                    id: "foo",
                },
            ];
            const message: AddLinkedDataDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.reorderLinkedData,
                linkedData,
                dataLocation: "linkedData",
            }) as AddLinkedDataDataMessageOutgoing;

            expect(Array.isArray((message.data as any).linkedData)).toEqual(true);
            expect((message.data as any).linkedData.length).toEqual(2);
            expect((message.data as any).linkedData[0].id).toEqual("bar");
            expect((message.data as any).linkedData[1].id).toEqual("foo");
        });
    });
    describe("navigation", () => {
        test("should return messages sent with navigation updates", () => {
            const dictionaryId: string = "foo";
            const navigationConfigId: string = "";
            const message: NavigationMessageOutgoing = getMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: dictionaryId,
                activeNavigationConfigId: navigationConfigId,
            }) as NavigationMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.navigation);
            expect(message.action).toEqual(MessageSystemNavigationTypeAction.update);
            expect(message.activeDictionaryId).toEqual(dictionaryId);
            expect(message.activeNavigationConfigId).toEqual(navigationConfigId);
        });
        test("should return messages sent with navigation getter", () => {
            const dictionaryId: string = "data";
            const navigationConfigId: string = "";

            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            }) as InitializeMessageOutgoing;
            const message: GetNavigationMessageOutgoing = getMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.get,
            }) as GetNavigationMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.navigation);
            expect(message.action).toEqual(MessageSystemNavigationTypeAction.get);
            expect(message.activeDictionaryId).toEqual(dictionaryId);
            expect(message.activeNavigationConfigId).toEqual(navigationConfigId);

            const navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataBlob
            );

            expect(message.navigation).toEqual(
                navigationDictionary[0][message.activeDictionaryId]
            );
        });
    });
    describe("dataDictionary", () => {
        test("should return messages sent to get the data dictionary", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const getDataDictionary: GetDataDictionaryMessageOutgoing = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            } as GetDataDictionaryMessageIncoming) as GetDataDictionaryMessageOutgoing;

            expect(getDataDictionary.type).toEqual(MessageSystemType.dataDictionary);
            expect(getDataDictionary.action).toEqual(
                MessageSystemDataDictionaryTypeAction.get
            );
            expect(getDataDictionary.dataDictionary).toEqual(dataBlob);
            expect(getDataDictionary.activeDictionaryId).toEqual(dataBlob[1]);
        });
        test("should return messages set to update the active id of the data dictionary", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    abc: {
                        schemaId: "foo",
                        data: {
                            foo: [
                                {
                                    id: "def",
                                },
                            ],
                        },
                    },
                    def: {
                        schemaId: "foo",
                        parent: {
                            id: "abc",
                            dataLocation: "foo",
                        },
                        data: {
                            bat: "baz",
                        },
                    },
                },
                "abc",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });

            const updateDataDictionaryActiveId: UpdateActiveIdDataDictionaryMessageOutgoing = getMessage(
                {
                    type: MessageSystemType.dataDictionary,
                    action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                    activeDictionaryId: "def",
                } as UpdateActiveIdDataDictionaryMessageIncoming
            ) as UpdateActiveIdDataDictionaryMessageOutgoing;

            expect(updateDataDictionaryActiveId.type).toEqual(
                MessageSystemType.dataDictionary
            );
            expect(updateDataDictionaryActiveId.action).toEqual(
                MessageSystemDataDictionaryTypeAction.updateActiveId
            );
            expect(updateDataDictionaryActiveId.activeDictionaryId).toEqual("def");
        });
    });
    describe("navigationDictionary", () => {
        test("should return messages sent to get the navigation dictionary", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const getNavigationDictionary: GetNavigationDictionaryMessageOutgoing = getMessage(
                {
                    type: MessageSystemType.navigationDictionary,
                    action: MessageSystemNavigationDictionaryTypeAction.get,
                } as GetNavigationDictionaryMessageIncoming
            ) as GetNavigationDictionaryMessageOutgoing;

            expect(getNavigationDictionary.type).toEqual(
                MessageSystemType.navigationDictionary
            );
            expect(getNavigationDictionary.action).toEqual(
                MessageSystemNavigationDictionaryTypeAction.get
            );
            expect(getNavigationDictionary.navigationDictionary).not.toEqual(undefined);
            expect(getNavigationDictionary.activeDictionaryId).not.toEqual(undefined);
        });
        test("should return messages set to update the active id of the navigation dictionary", () => {
            const dataBlob: DataDictionary<unknown> = [
                {
                    data: {
                        schemaId: "foo",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "data",
            ];
            const schemaDictionary: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });

            const updateNavigationDictionaryActiveId: UpdateActiveIdNavigationDictionaryMessageOutgoing = getMessage(
                {
                    type: MessageSystemType.navigationDictionary,
                    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                    activeDictionaryId: "nav2",
                } as UpdateActiveIdNavigationDictionaryMessageIncoming
            ) as UpdateActiveIdNavigationDictionaryMessageOutgoing;

            expect(updateNavigationDictionaryActiveId.type).toEqual(
                MessageSystemType.navigationDictionary
            );
            expect(updateNavigationDictionaryActiveId.action).toEqual(
                MessageSystemNavigationDictionaryTypeAction.updateActiveId
            );
            expect(updateNavigationDictionaryActiveId.activeDictionaryId).toEqual("nav2");
        });
    });
    describe("validation", () => {
        test("should return messages sent to update the validation", () => {
            const validationUpdate: ValidationMessageIncoming = {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.update,
                validationErrors: [
                    {
                        invalidMessage: "foo",
                        dataLocation: "",
                    },
                ],
                dictionaryId: "foo",
            };

            expect(getMessage(validationUpdate)).toEqual(validationUpdate);
        });
        test("should return messages sent to get the validation", () => {
            const getValidation: ValidationMessageIncoming = {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.get,
                dictionaryId: "bar",
            };

            const validationUpdate: ValidationMessageIncoming = {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.update,
                validationErrors: [
                    {
                        invalidMessage: "bar",
                        dataLocation: "",
                    },
                ],
                dictionaryId: "bar",
            };

            getMessage(validationUpdate);

            expect(getMessage(getValidation)).toEqual({
                ...getValidation,
                validationErrors: validationUpdate.validationErrors,
            });
        });
        test("should return custom messages sent", () => {
            const customMessage: any = {
                type: MessageSystemType.custom,
                foo: "bar",
            };

            expect(getMessage(customMessage)).toEqual(customMessage);
        });
    });
});
