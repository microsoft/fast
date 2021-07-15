import { expect } from "chai";
import { DataType } from "../data-utilities/types";
import { linkedDataSchema } from "../schemas";
import {
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemValidationTypeAction,
} from "./message-system.utilities.props";
import { MessageSystemType } from "./types";
import { getMessage } from "./message-system.utilities";
import { getNavigationDictionary } from "./navigation";
describe("getMessage", () => {
    describe("history", () => {
        it("should return messages sent to get the history", () => {
            const getHistory = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };
            expect(getMessage(getHistory)).to.deep.equal({
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
                history: {
                    items: [],
                    limit: 30,
                },
            });
        });
        it("should update the history when a new message has been sent", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            });
            const getHistory = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };
            expect(getMessage(getHistory).history.items.length).to.equal(1);
        });
        it("should remove the first item in the array if another item is added that would be higher than the limit", () => {
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            function dataFactory(count) {
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
                });
            }
            const getHistory = {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
            };
            expect(getMessage(getHistory).history.items.length).to.equal(30);
            expect(getMessage(getHistory).history.items[29].data.foo).to.equal("bar49");
        });
    });
    describe("initialize", () => {
        it("should return messages sent with initial values provided", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            const message = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            });
            expect(message.type).to.equal(MessageSystemType.initialize);
            expect(message.data).to.equal(dataBlob[0][dataBlob[1]].data);
            expect(message.schema).to.equal(schemaDictionary["foo"]);
            expect(typeof message.navigation).to.equal("object");
        });
        it("should return messages sent with initial values provided using the deprecated data property", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            const message = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
            });
            expect(message.type).to.equal(MessageSystemType.initialize);
            expect(message.data).to.equal(dataBlob[0][dataBlob[1]].data);
            expect(message.schema).to.equal(schemaDictionary["foo"]);
            expect(typeof message.navigation).to.equal("object");
        });
        it("should return messages sent with a dictionary id provided", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            const message = getMessage({
                type: MessageSystemType.initialize,
                dataDictionary: dataBlob,
                schemaDictionary,
                dictionaryId: "data2",
            });
            expect(message.type).to.equal(MessageSystemType.initialize);
            expect(message.activeDictionaryId).to.equal("data2");
        });
    });
    describe("data", () => {
        it("should return a data blob with duplicated values", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: "foo",
            });
            expect(message.data).to.deep.equal({ foo: ["bar", "bar"] });
        });
        it("should return a data blob without removed values", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                dataLocation: "foo",
            });
            expect(message.data).to.deep.equal({});
        });
        it("should return a data blob with added values", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                dataLocation: "hello",
                data: "world",
                dataType: DataType.object,
            });
            expect(message.data).to.deep.equal({ hello: "world" });
        });
        it("should return a data blob with updated values", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: "hello",
                data: "venus",
            });
            expect(message.data).to.deep.equal({ hello: "venus" });
        });
        it("should return a data blob with updated values when the data is at the root", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: "",
                data: { hello: "venus" },
            });
            expect(message.data).to.deep.equal({ hello: "venus" });
        });
        it("should return a data blob with updated values when a dictionaryId has been specified", () => {
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dictionaryId: "bar",
                dataLocation: "",
                data: { hello: "venus" },
            });
            expect(message.data).to.deep.equal({ hello: "venus" });
            expect(message.dataDictionary).to.deep.equal([
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
            const linkedData = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(Array.isArray(message.data.linkedData)).to.equal(true);
            expect(message.data.linkedData.length).to.equal(1);
            const id = message.data.linkedData[0].id;
            const dictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(dictionaryKey => {
                    return dictionaryKey === id;
                })
            ).not.to.equal(-1);
            expect(dictionary.dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
            expect(message.linkedDataIds).to.deep.equal([{ id }]);
        });
        it("should add linkedData to the data and the data dictionary when specifying a dictionary ID", () => {
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
            const linkedData = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                dictionaryId: "abc",
                linkedData,
                dataLocation: "linkedData",
            });
            expect(Array.isArray(message.dataDictionary[0].abc.data.linkedData)).to.equal(
                true
            );
            expect(message.dataDictionary[0].abc.data.linkedData.length).to.equal(1);
            const id = message.dataDictionary[0].abc.data.linkedData[0].id;
            const dictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(dictionaryKey => {
                    return dictionaryKey === id;
                })
            ).not.to.equal(-1);
            expect(dictionary.dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
            expect(dictionary.dataDictionary[0].abc.data.linkedData).to.deep.equal([
                { id },
            ]);
        });
        it("should add linkedData to an existing array of linkedData items", () => {
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
            const linkedData = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                    dataLocation: "linkedData",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(Array.isArray(message.data.linkedData)).to.equal(true);
            expect(message.data.linkedData.length).to.equal(2);
            const id = message.data.linkedData[1].id;
            const dictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(dictionaryKey => {
                    return dictionaryKey === id;
                })
            ).not.to.equal(-1);
            expect(dictionary.dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
        });
        it("should add linkedData to a specific index of an existing array of linkedData items", () => {
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
            const linkedData = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
                index: 0,
            });
            expect(Array.isArray(message.data.linkedData)).to.equal(true);
            expect(message.data.linkedData.length).to.equal(2);
            const id = message.data.linkedData[0].id;
            const dictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(dictionaryKey => {
                    return dictionaryKey === id;
                })
            ).not.to.equal(-1);
            expect(dictionary.dataDictionary[0][id].data).to.deep.equal(
                linkedData[0].data
            );
        });
        it("should add nested linked data to the data dictionary", () => {
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
            const linkedData = [
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
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(Array.isArray(message.data.linkedData)).to.equal(true);
            expect(message.data.linkedData.length).to.equal(1);
            const id = message.data.linkedData[0].id;
            const nestedId = message.dataDictionary[0][id].data.linkedData[0].id;
            const dictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(
                Object.keys(dictionary.dataDictionary[0]).findIndex(dictionaryKey => {
                    return dictionaryKey === id;
                })
            ).not.to.equal(-1);
            expect(message.linkedDataIds).to.deep.equal([{ id: nestedId }, { id }]);
        });
        it("should remove linkedData from the data and the data dictionary", () => {
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
            const linkedData = [
                {
                    id: "data2",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(message.data.linkedData).to.deep.equal([]);
        });
        it("should remove linkedData from the data and the data dictionary when specifying a dictionary ID", () => {
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
            const linkedData = [
                {
                    id: "data2",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dictionaryId: "data",
                dataLocation: "linkedData",
            });
            expect(message.dataDictionary[0].data.data.linkedData).to.deep.equal([]);
        });
        it("should remove linkedData and linked data items from the data and the data dictionary", () => {
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
            const linkedData = [
                {
                    id: "data2",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(message.data.linkedData).to.deep.equal([]);
            expect(message.dataDictionary).to.deep.equal([
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
            expect(message.linkedDataIds).to.deep.equal(["data2", "data3"]);
        });
        it("should reorder linkedData in the exist array of linkedData items", () => {
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
            const linkedData = [
                {
                    id: "bar",
                },
                {
                    id: "foo",
                },
            ];
            const message = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.reorderLinkedData,
                linkedData,
                dataLocation: "linkedData",
            });
            expect(Array.isArray(message.data.linkedData)).to.equal(true);
            expect(message.data.linkedData.length).to.equal(2);
            expect(message.data.linkedData[0].id).to.equal("bar");
            expect(message.data.linkedData[1].id).to.equal("foo");
        });
    });
    describe("navigation", () => {
        it("should return messages sent with navigation updates", () => {
            const dictionaryId = "foo";
            const navigationConfigId = "";
            const message = getMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: dictionaryId,
                activeNavigationConfigId: navigationConfigId,
            });
            expect(message.type).to.equal(MessageSystemType.navigation);
            expect(message.action).to.equal(MessageSystemNavigationTypeAction.update);
            expect(message.activeDictionaryId).to.equal(dictionaryId);
            expect(message.activeNavigationConfigId).to.equal(navigationConfigId);
        });
        it("should return messages sent with navigation getter", () => {
            const dictionaryId = "data";
            const navigationConfigId = "";
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const message = getMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.get,
            });
            expect(message.type).to.equal(MessageSystemType.navigation);
            expect(message.action).to.equal(MessageSystemNavigationTypeAction.get);
            expect(message.activeDictionaryId).to.equal(dictionaryId);
            expect(message.activeNavigationConfigId).to.equal(navigationConfigId);
            const navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataBlob
            );
            expect(message.navigation).to.deep.equal(
                navigationDictionary[0][message.activeDictionaryId]
            );
        });
    });
    describe("dataDictionary", () => {
        it("should return messages sent to get the data dictionary", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const getDataDictionary = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
            });
            expect(getDataDictionary.type).to.equal(MessageSystemType.dataDictionary);
            expect(getDataDictionary.action).to.equal(
                MessageSystemDataDictionaryTypeAction.get
            );
            expect(getDataDictionary.dataDictionary).to.deep.equal(dataBlob);
            expect(getDataDictionary.activeDictionaryId).to.equal(dataBlob[1]);
        });
        it("should return messages set to update the active id of the data dictionary", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const updateDataDictionaryActiveId = getMessage({
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                activeDictionaryId: "def",
            });
            expect(updateDataDictionaryActiveId.type).to.equal(
                MessageSystemType.dataDictionary
            );
            expect(updateDataDictionaryActiveId.action).to.equal(
                MessageSystemDataDictionaryTypeAction.updateActiveId
            );
            expect(updateDataDictionaryActiveId.activeDictionaryId).to.equal("def");
        });
    });
    describe("navigationDictionary", () => {
        it("should return messages sent to get the navigation dictionary", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const getNavigationDictionary = getMessage({
                type: MessageSystemType.navigationDictionary,
                action: MessageSystemNavigationDictionaryTypeAction.get,
            });
            expect(getNavigationDictionary.type).to.equal(
                MessageSystemType.navigationDictionary
            );
            expect(getNavigationDictionary.action).to.equal(
                MessageSystemNavigationDictionaryTypeAction.get
            );
            expect(getNavigationDictionary.navigationDictionary).not.to.equal(undefined);
            expect(getNavigationDictionary.activeDictionaryId).not.to.equal(undefined);
        });
        it("should return messages set to update the active id of the navigation dictionary", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const updateNavigationDictionaryActiveId = getMessage({
                type: MessageSystemType.navigationDictionary,
                action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                activeDictionaryId: "nav2",
            });
            expect(updateNavigationDictionaryActiveId.type).to.equal(
                MessageSystemType.navigationDictionary
            );
            expect(updateNavigationDictionaryActiveId.action).to.equal(
                MessageSystemNavigationDictionaryTypeAction.updateActiveId
            );
            expect(updateNavigationDictionaryActiveId.activeDictionaryId).to.equal(
                "nav2"
            );
        });
    });
    describe("schemaDictionary", () => {
        it("should add schemas to the schema dictionary", () => {
            const dataBlob = [
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
            const schemaDictionary = {
                foo: { $id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemaDictionary,
            });
            const addedSchemaDictionary = getMessage({
                type: MessageSystemType.schemaDictionary,
                action: MessageSystemSchemaDictionaryTypeAction.add,
                schemas: [
                    {
                        $id: "bar",
                        type: "string",
                    },
                ],
            });
            expect(addedSchemaDictionary.type).to.equal(
                MessageSystemType.schemaDictionary
            );
            expect(addedSchemaDictionary.action).to.equal(
                MessageSystemSchemaDictionaryTypeAction.add
            );
            expect(addedSchemaDictionary.schemaDictionary.bar).not.to.be.undefined;
            expect(addedSchemaDictionary.schemaDictionary.foo).not.to.be.undefined;
        });
    });
    describe("validation", () => {
        it("should return messages sent to update the validation", () => {
            const validationUpdate = {
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
            const message = getMessage(validationUpdate);
            expect(message.type).to.equal(validationUpdate.type);
            expect(message.action).to.equal(validationUpdate.action);
            expect(message.validationErrors).to.deep.equal(
                validationUpdate.validationErrors
            );
            expect(message.dictionaryId).to.equal(validationUpdate.dictionaryId);
        });
        it("should return messages sent to get the validation", () => {
            const getValidation = {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.get,
                dictionaryId: "bar",
            };
            const validationUpdate = {
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
            getMessage(getValidation);
            const message = getMessage(validationUpdate);
            expect(message.type).to.equal(getValidation.type);
            expect(message.action).to.equal(validationUpdate.action);
            expect(message.validationErrors).to.deep.equal(
                validationUpdate.validationErrors
            );
            expect(message.dictionaryId).to.equal(getValidation.dictionaryId);
        });
        it("should return custom messages sent", () => {
            const customMessage = {
                type: MessageSystemType.custom,
                foo: "bar",
            };
            expect(getMessage(customMessage)).to.deep.equal(customMessage);
        });
    });
});
