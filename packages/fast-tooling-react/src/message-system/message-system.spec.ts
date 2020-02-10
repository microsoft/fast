import jest from "jest";
import {
    AddChildrenDataMessageOutgoing,
    AddDataMessageOutgoing,
    DuplicateDataMessageOutgoing,
    GetDataDictionaryMessageIncoming,
    GetDataDictionaryMessageOutgoing,
    GetNavigationDictionaryMessageIncoming,
    GetNavigationDictionaryMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    NavigationMessageOutgoing,
    RemoveDataMessageOutgoing,
    UpdateActiveIdDataDictionaryMessageIncoming,
    UpdateActiveIdDataDictionaryMessageOutgoing,
    UpdateActiveIdNavigationDictionaryMessageIncoming,
    UpdateActiveIdNavigationDictionaryMessageOutgoing,
    UpdateDataMessageOutgoing,
} from "./message-system.props";
import { getMessage } from "./message-system";
import { DataType } from "../data-utilities/types";
import { Children, Data, DataDictionary } from "./data.props";
import { SchemaDictionary } from "./schema.props";

/* tslint:disable */
describe("getMessage", () => {
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
            const schemas: SchemaDictionary = {
                foo: { id: "foo" },
            };
            const message: InitializeMessageOutgoing = getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemas,
            }) as InitializeMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.initialize);
            expect(message.data).toEqual(dataBlob[0][dataBlob[1]].data);
            expect(message.schema).toEqual(schemas["foo"]);
            expect(typeof message.navigation).toEqual("object");
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
                schemas: {
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
                schemas: {
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
                schemas: {
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
                schemas: {
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
                schemas: {
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
        test("should add children to the data and the data dictionary", () => {
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
                schemas: {
                    foo: { id: "foo" },
                },
            });
            const children: Data<unknown>[] = [
                {
                    schemaId: "foo",
                    data: {
                        hello: "world",
                    },
                },
            ];
            const message: AddChildrenDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addChildren,
                children,
                dataLocation: "children",
            }) as AddChildrenDataMessageOutgoing;

            expect(Array.isArray((message.data as any).children)).toEqual(true);
            expect((message.data as any).children.length).toEqual(1);

            const id: string = (message.data as any).children[0].id;
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
            expect(dictionary.dataDictionary[0][id]).toEqual(children[0]);
        });
        test("should remove children from the data and the data dictionary", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        data: {
                            schemaId: "foo",
                            data: {
                                children: [
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
                schemas: {
                    foo: { id: "foo" },
                },
            });
            const children: Children[] = [
                {
                    id: "data2",
                },
            ];
            const message: AddChildrenDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeChildren,
                children,
                dataLocation: "children",
            }) as AddChildrenDataMessageOutgoing;

            expect((message.data as any).children).toEqual([]);
        });
    });
    describe("navigation", () => {
        test("should return messages sent with navigation updates", () => {
            const id: string = "foo";
            const message: NavigationMessageOutgoing = getMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeId: id,
            }) as NavigationMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.navigation);
            expect(message.action).toEqual(MessageSystemNavigationTypeAction.update);
            expect(message.activeId).toEqual(id);
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
            const schemas: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemas,
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
            expect(getDataDictionary.activeId).toEqual(dataBlob[1]);
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
                        },
                        data: {
                            bat: "baz",
                        },
                    },
                },
                "abc",
            ];
            const schemas: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemas,
            });

            const updateDataDictionaryActiveId: UpdateActiveIdDataDictionaryMessageOutgoing = getMessage(
                {
                    type: MessageSystemType.dataDictionary,
                    action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                    activeId: "def",
                } as UpdateActiveIdDataDictionaryMessageIncoming
            ) as UpdateActiveIdDataDictionaryMessageOutgoing;

            expect(updateDataDictionaryActiveId.type).toEqual(
                MessageSystemType.dataDictionary
            );
            expect(updateDataDictionaryActiveId.action).toEqual(
                MessageSystemDataDictionaryTypeAction.updateActiveId
            );
            expect(updateDataDictionaryActiveId.activeId).toEqual("def");
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
            const schemas: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemas,
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
            expect(getNavigationDictionary.activeId).not.toEqual(undefined);
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
            const schemas: SchemaDictionary = {
                foo: { id: "foo" },
            };
            getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schemas,
            });

            const updateNavigationDictionaryActiveId: UpdateActiveIdNavigationDictionaryMessageOutgoing = getMessage(
                {
                    type: MessageSystemType.navigationDictionary,
                    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                    activeId: "nav2",
                } as UpdateActiveIdNavigationDictionaryMessageIncoming
            ) as UpdateActiveIdNavigationDictionaryMessageOutgoing;

            expect(updateNavigationDictionaryActiveId.type).toEqual(
                MessageSystemType.navigationDictionary
            );
            expect(updateNavigationDictionaryActiveId.action).toEqual(
                MessageSystemNavigationDictionaryTypeAction.updateActiveId
            );
            expect(updateNavigationDictionaryActiveId.activeId).toEqual("nav2");
        });
    });
});
