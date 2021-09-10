import { expect } from "chai";
import { DataType } from "../data-utilities/types";
import { linkedDataSchema } from "../schemas";
import {
    AddDataMessageOutgoing,
    AddLinkedDataDataMessageOutgoing,
    AddSchemaDictionaryMessageOutgoing,
    DuplicateDataMessageOutgoing,
    GetDataDictionaryMessageOutgoing,
    GetHistoryMessageIncoming,
    GetHistoryMessageOutgoing,
    GetNavigationDictionaryMessageOutgoing,
    GetNavigationMessageOutgoing,
    InitializeMessageOutgoing,
    InternalIncomingMessage,
    InternalOutgoingMessage,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemValidationTypeAction,
    NavigationMessageOutgoing,
    RemoveDataMessageOutgoing,
    UpdateActiveIdDataDictionaryMessageOutgoing,
    UpdateActiveIdNavigationDictionaryMessageOutgoing,
    UpdateDataMessageOutgoing,
    UpdateValidationMessageIncoming,
    ValidationMessageIncoming,
    ValidationMessageOutgoing,
} from "./message-system.utilities.props";
import { MessageSystemType } from "./types";
import { getMessage } from "./message-system.utilities";
import { Data, DataDictionary, LinkedData } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { getNavigationDictionary } from "./navigation";

describe("getMessage", () => {
    describe("history", () => {
        it("should return messages sent to get the history", () => {
            const getHistory: InternalIncomingMessage<GetHistoryMessageIncoming> = [
                {
                    type: MessageSystemType.history,
                    action: MessageSystemHistoryTypeAction.get,
                },
                "",
            ];
            expect(getMessage(getHistory)).to.deep.equal([
                {
                    type: MessageSystemType.history,
                    action: MessageSystemHistoryTypeAction.get,
                    history: {
                        items: [],
                        limit: 30,
                    },
                },
                "",
            ]);
        });
        it("should update the history when a new message has been sent", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    dataDictionary: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);

            const getHistory: GetHistoryMessageIncoming = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };

            expect(
                (getMessage([getHistory, ""])[0] as GetHistoryMessageOutgoing).history
                    .items.length
            ).to.equal(1);
        });
        it("should remove the first item in the array if another item is added that would be higher than the limit", () => {
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
                getMessage([
                    {
                        type: MessageSystemType.initialize,
                        dataDictionary: dataFactory(i),
                        schemaDictionary,
                    },
                    "",
                ]);
            }

            const getHistory: GetHistoryMessageIncoming = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };

            expect(
                (getMessage([getHistory, ""])[0] as GetHistoryMessageOutgoing).history
                    .items.length
            ).to.equal(30);
            expect(
                ((getMessage([getHistory, ""])[0] as GetHistoryMessageOutgoing).history
                    .items[29] as any).data.foo
            ).to.equal("bar49");
        });
    });
    describe("initialize", () => {
        it("should return messages sent with initial values provided", () => {
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
            const message: InternalOutgoingMessage<InitializeMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.initialize,
                        dataDictionary: dataBlob,
                        schemaDictionary,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<InitializeMessageOutgoing>;

            expect(message[0].type).to.equal(MessageSystemType.initialize);
            expect(message[0].data).to.equal(dataBlob[0][dataBlob[1]].data);
            expect(message[0].schema).to.equal(schemaDictionary["foo"]);
            expect(typeof message[0].navigation).to.equal("object");
        });
        it("should return messages sent with initial values provided using the deprecated data property", () => {
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
            const message: InternalOutgoingMessage<InitializeMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.initialize,
                        dataDictionary: dataBlob,
                        schemaDictionary,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<InitializeMessageOutgoing>;

            expect(message[0].type).to.equal(MessageSystemType.initialize);
            expect(message[0].data).to.equal(dataBlob[0][dataBlob[1]].data);
            expect(message[0].schema).to.equal(schemaDictionary["foo"]);
            expect(typeof message[0].navigation).to.equal("object");
        });
        it("should return messages sent with a dictionary id provided", () => {
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
            const message: InternalOutgoingMessage<InitializeMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.initialize,
                        dataDictionary: dataBlob,
                        schemaDictionary,
                        dictionaryId: "data2",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<InitializeMessageOutgoing>;

            expect(message[0].type).to.equal(MessageSystemType.initialize);
            expect(message[0].activeDictionaryId).to.equal("data2");
        });
    });
    describe("data", () => {
        it("should return a data blob with duplicated values", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<DuplicateDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.duplicate,
                        sourceDataLocation: "foo",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<DuplicateDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({ foo: ["bar", "bar"] });
        });
        it("should return a data blob without removed values", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<RemoveDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.remove,
                        dataLocation: "foo",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<RemoveDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({});
        });
        it("should return a data blob with added values", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<AddDataMessageOutgoing> = getMessage([
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.add,
                    dataLocation: "hello",
                    data: "world",
                    dataType: DataType.object,
                },
                "",
            ]) as InternalOutgoingMessage<AddDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({ hello: "world" });
        });
        it("should return a data blob with updated values", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<UpdateDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dataLocation: "hello",
                        data: "venus",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<UpdateDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({ hello: "venus" });
        });
        it("should return a data blob with updated values when the data is at the root", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<UpdateDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dataLocation: "",
                        data: { hello: "venus" },
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<UpdateDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({ hello: "venus" });
        });
        it("should return a data blob with updated values when a dictionaryId has been specified", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const message: InternalOutgoingMessage<UpdateDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dictionaryId: "bar",
                        dataLocation: "",
                        data: { hello: "venus" },
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<UpdateDataMessageOutgoing>;

            expect(message[0].data).to.deep.equal({ hello: "venus" });
            expect(message[0].dataDictionary).to.deep.equal([
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
        it("should add linkedData to the data and the data dictionary", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(Array.isArray((message[0].data as any).linkedData)).to.equal(true);
            expect((message[0].data as any).linkedData.length).to.equal(1);

            const id: string = (message[0].data as any).linkedData[0].id;
            const dictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(
                Object.keys(message[0].dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.to.equal(-1);
            expect(dictionary[0].dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
            expect(message[0].linkedDataIds).to.deep.equal([{ id }]);
        });
        it("should add linkedData to the data and the data dictionary when specifying a dictionary ID", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        dictionaryId: "abc",
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(
                Array.isArray((message[0].dataDictionary[0].abc.data as any).linkedData)
            ).to.equal(true);
            expect(
                (message[0].dataDictionary[0].abc.data as any).linkedData.length
            ).to.equal(1);

            const id: string = (message[0].dataDictionary[0].abc.data as any)
                .linkedData[0].id;
            const dictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(
                Object.keys(dictionary[0].dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.to.equal(-1);
            expect(dictionary[0].dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
            expect(
                (dictionary[0].dataDictionary[0].abc.data as any).linkedData
            ).to.deep.equal([{ id }]);
        });
        it("should add linkedData to an existing array of linkedData items", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(Array.isArray((message[0].data as any).linkedData)).to.equal(true);
            expect((message[0].data as any).linkedData.length).to.equal(2);

            const id: string = (message[0].data as any).linkedData[1].id;
            const dictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(
                Object.keys(dictionary[0].dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.to.equal(-1);
            expect(dictionary[0].dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
        });
        it("should add linkedData to a specific index of an existing array of linkedData items", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                        index: 0,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(Array.isArray((message[0].data as any).linkedData)).to.equal(true);
            expect((message[0].data as any).linkedData.length).to.equal(2);

            const id: string = (message[0].data as any).linkedData[0].id;
            const dictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(
                Object.keys(dictionary[0].dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.to.equal(-1);
            expect(dictionary[0].dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
        });
        it("should add nested linked data to the data dictionary", () => {
            getMessage([
                {
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
                },
                "",
            ]);
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
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(Array.isArray((message[0].data as any).linkedData)).to.equal(true);
            expect((message[0].data as any).linkedData.length).to.equal(1);

            const id: string = (message[0].data as any).linkedData[0].id;
            const nestedId: string = (message[0].dataDictionary[0][id].data as any)
                .linkedData[0].id;
            const dictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(
                Object.keys(dictionary[0].dataDictionary[0]).findIndex(
                    (dictionaryKey: string) => {
                        return dictionaryKey === id;
                    }
                )
            ).not.to.equal(-1);
            expect(message[0].linkedDataIds).to.deep.equal([{ id: nestedId }, { id }]);
        });
        it("should remove linkedData from the data and the data dictionary", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect((message[0].data as any).linkedData).to.deep.equal([]);
        });
        it("should remove linkedData from the data and the data dictionary when specifying a dictionary ID", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        linkedData,
                        dictionaryId: "data",
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(
                (message[0].dataDictionary[0].data.data as any).linkedData
            ).to.deep.equal([]);
        });
        it("should remove linkedData and linked data items from the data and the data dictionary", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: LinkedData[] = [
                {
                    id: "data2",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect((message[0].data as any).linkedData).to.deep.equal([]);
            expect(message[0].dataDictionary).to.deep.equal([
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
            expect(message[0].linkedDataIds).to.deep.equal(["data2", "data3"]);
        });
        it("should reorder linkedData in the exist array of linkedData items", () => {
            getMessage([
                {
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
                },
                "",
            ]);
            const linkedData: LinkedData[] = [
                {
                    id: "bar",
                },
                {
                    id: "foo",
                },
            ];
            const message: InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.reorderLinkedData,
                        linkedData,
                        dataLocation: "linkedData",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddLinkedDataDataMessageOutgoing>;

            expect(Array.isArray((message[0].data as any).linkedData)).to.equal(true);
            expect((message[0].data as any).linkedData.length).to.equal(2);
            expect((message[0].data as any).linkedData[0].id).to.equal("bar");
            expect((message[0].data as any).linkedData[1].id).to.equal("foo");
        });
    });
    describe("navigation", () => {
        it("should return messages sent with navigation updates", () => {
            const dictionaryId: string = "foo";
            const navigationConfigId: string = "";
            const message: InternalOutgoingMessage<NavigationMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.navigation,
                        action: MessageSystemNavigationTypeAction.update,
                        activeDictionaryId: dictionaryId,
                        activeNavigationConfigId: navigationConfigId,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<NavigationMessageOutgoing>;

            expect(message[0].type).to.equal(MessageSystemType.navigation);
            expect(message[0].action).to.equal(MessageSystemNavigationTypeAction.update);
            expect(message[0].activeDictionaryId).to.equal(dictionaryId);
            expect(message[0].activeNavigationConfigId).to.equal(navigationConfigId);
        });
        it("should return messages sent with navigation getter", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);
            const message: InternalOutgoingMessage<GetNavigationMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.navigation,
                        action: MessageSystemNavigationTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetNavigationMessageOutgoing>;

            expect(message[0].type).to.equal(MessageSystemType.navigation);
            expect(message[0].action).to.equal(MessageSystemNavigationTypeAction.get);
            expect(message[0].activeDictionaryId).to.equal(dictionaryId);
            expect(message[0].activeNavigationConfigId).to.equal(navigationConfigId);

            const navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataBlob
            );

            expect(message[0].navigation).to.deep.equal(
                navigationDictionary[0][message[0].activeDictionaryId]
            );
        });
    });
    describe("dataDictionary", () => {
        it("should return messages sent to get the data dictionary", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);
            const getDataDictionary: InternalOutgoingMessage<GetDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetDataDictionaryMessageOutgoing>;

            expect(getDataDictionary[0].type).to.equal(MessageSystemType.dataDictionary);
            expect(getDataDictionary[0].action).to.equal(
                MessageSystemDataDictionaryTypeAction.get
            );
            expect(getDataDictionary[0].dataDictionary).to.deep.equal(dataBlob);
            expect(getDataDictionary[0].activeDictionaryId).to.equal(dataBlob[1]);
        });
        it("should return messages set to update the active id of the data dictionary", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);

            const updateDataDictionaryActiveId: InternalOutgoingMessage<UpdateActiveIdDataDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.dataDictionary,
                        action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                        activeDictionaryId: "def",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<UpdateActiveIdDataDictionaryMessageOutgoing>;

            expect(updateDataDictionaryActiveId[0].type).to.equal(
                MessageSystemType.dataDictionary
            );
            expect(updateDataDictionaryActiveId[0].action).to.equal(
                MessageSystemDataDictionaryTypeAction.updateActiveId
            );
            expect(updateDataDictionaryActiveId[0].activeDictionaryId).to.equal("def");
        });
    });
    describe("navigationDictionary", () => {
        it("should return messages sent to get the navigation dictionary", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);
            const getNavigationDictionary: InternalOutgoingMessage<GetNavigationDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.navigationDictionary,
                        action: MessageSystemNavigationDictionaryTypeAction.get,
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<GetNavigationDictionaryMessageOutgoing>;

            expect(getNavigationDictionary[0].type).to.equal(
                MessageSystemType.navigationDictionary
            );
            expect(getNavigationDictionary[0].action).to.equal(
                MessageSystemNavigationDictionaryTypeAction.get
            );
            expect(getNavigationDictionary[0].navigationDictionary).not.to.equal(
                undefined
            );
            expect(getNavigationDictionary[0].activeDictionaryId).not.to.equal(undefined);
        });
        it("should return messages set to update the active id of the navigation dictionary", () => {
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
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);

            const updateNavigationDictionaryActiveId: InternalOutgoingMessage<UpdateActiveIdNavigationDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.navigationDictionary,
                        action:
                            MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                        activeDictionaryId: "nav2",
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<
                UpdateActiveIdNavigationDictionaryMessageOutgoing
            >;

            expect(updateNavigationDictionaryActiveId[0].type).to.equal(
                MessageSystemType.navigationDictionary
            );
            expect(updateNavigationDictionaryActiveId[0].action).to.equal(
                MessageSystemNavigationDictionaryTypeAction.updateActiveId
            );
            expect(updateNavigationDictionaryActiveId[0].activeDictionaryId).to.equal(
                "nav2"
            );
        });
    });
    describe("schemaDictionary", () => {
        it("should add schemas to the schema dictionary", () => {
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
                foo: { $id: "foo" },
            };
            getMessage([
                {
                    type: MessageSystemType.initialize,
                    data: dataBlob,
                    schemaDictionary,
                },
                "",
            ]);

            const addedSchemaDictionary: InternalOutgoingMessage<AddSchemaDictionaryMessageOutgoing> = getMessage(
                [
                    {
                        type: MessageSystemType.schemaDictionary,
                        action: MessageSystemSchemaDictionaryTypeAction.add,
                        schemas: [
                            {
                                $id: "bar",
                                type: "string",
                            },
                        ],
                    },
                    "",
                ]
            ) as InternalOutgoingMessage<AddSchemaDictionaryMessageOutgoing>;

            expect(addedSchemaDictionary[0].type).to.equal(
                MessageSystemType.schemaDictionary
            );
            expect(addedSchemaDictionary[0].action).to.equal(
                MessageSystemSchemaDictionaryTypeAction.add
            );
            expect(addedSchemaDictionary[0].schemaDictionary.bar).not.to.be.undefined;
            expect(addedSchemaDictionary[0].schemaDictionary.foo).not.to.be.undefined;
        });
    });
    describe("validation", () => {
        it("should return messages sent to update the validation", () => {
            const validationUpdate: InternalIncomingMessage<ValidationMessageIncoming> = [
                {
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.update,
                    validationErrors: [
                        {
                            invalidMessage: "foo",
                            dataLocation: "",
                        },
                    ],
                    dictionaryId: "foo",
                },
                "",
            ];
            const message = getMessage(validationUpdate) as InternalOutgoingMessage<
                ValidationMessageOutgoing
            >;

            expect(message[0].type).to.equal(validationUpdate[0].type);
            expect(message[0].action).to.equal(validationUpdate[0].action);
            expect(message[0].validationErrors).to.deep.equal(
                (validationUpdate[0] as ValidationMessageOutgoing).validationErrors
            );
            expect(message[0].dictionaryId).to.equal(validationUpdate[0].dictionaryId);
        });
        it("should return messages sent to get the validation", () => {
            const getValidation: InternalIncomingMessage<ValidationMessageIncoming> = [
                {
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.get,
                    dictionaryId: "bar",
                },
                "",
            ];

            const validationUpdate: InternalIncomingMessage<UpdateValidationMessageIncoming> = [
                {
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.update,
                    validationErrors: [
                        {
                            invalidMessage: "bar",
                            dataLocation: "",
                        },
                    ],
                    dictionaryId: "bar",
                },
                "",
            ];

            getMessage(getValidation);

            const message = getMessage(validationUpdate) as InternalOutgoingMessage<
                ValidationMessageOutgoing
            >;

            expect(message[0].type).to.equal(getValidation[0].type);
            expect(message[0].action).to.equal(validationUpdate[0].action);
            expect(message[0].validationErrors).to.deep.equal(
                validationUpdate[0].validationErrors
            );
            expect(message[0].dictionaryId).to.equal(getValidation[0].dictionaryId);
        });
        it("should return custom messages sent", () => {
            const customMessage: any = [
                {
                    type: MessageSystemType.custom,
                    foo: "bar",
                },
                "",
            ];

            expect(getMessage(customMessage)).to.deep.equal(customMessage);
        });
    });
});
