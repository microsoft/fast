import {
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    Register,
} from "../message-system";
import { MonacoAdaptor } from "./monaco-adaptor";
import { mapDataDictionaryToMonacoEditorHTML } from "./monaco";
import { MonacoAdaptorAction } from "./monaco-adaptor-action";

describe("MonacoAdaptor", () => {
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

            new MonacoAdaptor({
                messageSystem,
            });
        }).not.toThrow();
    });
    test("should not throw if the message system is undefined", () => {
        expect(() => {
            new MonacoAdaptor({
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

        expect(messageSystem["register"].size).toEqual(0);

        new MonacoAdaptor({
            messageSystem,
        });

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

        expect(messageSystem["register"].size).toEqual(0);

        const shortcuts: MonacoAdaptor = new MonacoAdaptor({
            messageSystem,
        });

        expect(messageSystem["register"].size).toEqual(1);

        shortcuts.destroy();

        expect(messageSystem["register"].size).toEqual(0);
    });
    test("should fire an action when a matching MessageSystemType is included", () => {
        let expectedValue = [];
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
            },
            "div",
        ];
        const schemaDictionary = {
            div: {
                id: "div",
                $id: "div",
                type: "object",
                mapsToTagName: "div",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        new MonacoAdaptor({
            messageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "foo",
                    action: config => {
                        expectedValue = config.getMonacoModelValue();
                    },
                    messageSystemType: MessageSystemType.initialize,
                }),
            ],
        });

        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                },
            } as any);
        });

        expect(expectedValue).toEqual([
            mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary),
        ]);
    });
    test("should fire an action when the corresponding id is used", () => {
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
            },
            "div",
        ];
        const schemaDictionary = {
            div: {
                id: "div",
                $id: "div",
                type: "object",
                mapsToTagName: "div",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        const runAction = jest.fn();
        const monacoAdaptor = new MonacoAdaptor({
            messageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "foo",
                    action: runAction,
                }),
            ],
        });

        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                },
            } as any);
        });

        monacoAdaptor.action("foo").run();

        expect(runAction).toHaveBeenCalledTimes(1);
    });
    test("should update the monaco value", () => {
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
            },
            "div",
        ];
        const schemaDictionary = {
            div: {
                id: "div",
                $id: "div",
                type: "object",
                mapsToTagName: "div",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        const monacoAdaptor = new MonacoAdaptor({
            messageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "foo",
                    action: config => {
                        config.updateMonacoModelValue(["bar"]);
                    },
                }),
            ],
        });

        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                },
            } as any);
        });

        monacoAdaptor.action("foo").run();

        expect(monacoAdaptor["monacoModelValue"]).toEqual(["bar"]);
    });
    test("should not update the monaco value if the message is from the adaptor", () => {
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
            },
            "div",
        ];
        const schemaDictionary = {
            div: {
                id: "div",
                $id: "div",
                type: "object",
                mapsToTagName: "div",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        const callback = jest.fn();
        new MonacoAdaptor({
            messageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "foo",
                    action: callback,
                    messageSystemType: MessageSystemType.initialize,
                }),
            ],
        });

        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                    options: {
                        from: "monaco-adaptor",
                    },
                },
            } as any);
        });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should update the dataDictionary to correct values when the monaco value has been updated", () => {
        const callback = jest.fn();
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
            },
            "div",
        ];
        const schemaDictionary = {
            div: {
                id: "div",
                $id: "div",
                type: "object",
                mapsToTagName: "div",
            },
            ul: {
                id: "ul",
                $id: "ul",
                type: "object",
                mapsToTagName: "ul",
            },
            text: {
                id: "text",
                $id: "text",
                type: "string",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        messageSystem.postMessage = callback;
        const monacoAdaptor = new MonacoAdaptor({
            messageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "foo",
                    action: config => {
                        config.updateMonacoModelValue(["<ul>", "foobar", "</ul>"]);
                    },
                }),
            ],
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary,
                },
            } as any);
        });

        monacoAdaptor.action("foo").run();

        const updatedDataDictionary = callback.mock.calls[0][0].dataDictionary;
        const root = updatedDataDictionary[1];
        const textId = updatedDataDictionary[0][updatedDataDictionary[1]].data.Slot[0].id;

        expect(updatedDataDictionary).toEqual([
            {
                [root]: {
                    schemaId: "ul",
                    data: {
                        Slot: [
                            {
                                id: textId,
                            },
                        ],
                    },
                },
                [textId]: {
                    schemaId: "text",
                    parent: {
                        id: root,
                        dataLocation: "Slot",
                    },
                    data: "foobar",
                },
            },
            root,
        ]);
    });
});
