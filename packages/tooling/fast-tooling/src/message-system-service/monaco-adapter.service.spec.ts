import chai, { expect } from "chai";
import spies from "chai-spies";
import {
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    Register,
} from "../message-system";
import { mapDataDictionaryToMonacoEditorHTML } from "../data-utilities/monaco";
import {
    findDictionaryIdParents,
    findUpdatedDictionaryId,
    MonacoAdapter,
    monacoAdapterId,
} from "./monaco-adapter.service";
import { MonacoAdapterAction } from "./monaco-adapter.service-action";

chai.use(spies);

/**
 * These tests rely on some async functionality.
 * They are therefore not included with the rest of the coverage
 * and should be run only locally when making changes to the MonacoAdapter service.
 *
 * TODO: enable these tests #4602
 */
/* eslint-disable @typescript-eslint/no-empty-function */
xdescribe("MonacoAdapter", () => {
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

            new MonacoAdapter({
                messageSystem,
            });
        }).not.to.throw();
    });
    it("should not throw if the message system is undefined", () => {
        expect(() => {
            new MonacoAdapter({
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

        new MonacoAdapter({
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

        const shortcuts: MonacoAdapter = new MonacoAdapter({
            messageSystem,
        });

        expect(messageSystem["register"].size).to.equal(1);

        shortcuts.destroy();

        expect(messageSystem["register"].size).to.equal(0);
    });
    it("should fire an action when a matching MessageSystemType is included", () => {
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
        new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
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

        expect(expectedValue).to.deep.equal([
            mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary),
        ]);
    });
    it("should change the dictionary id when a navigation event is fired", () => {
        const dataDictionary: DataDictionary<unknown> = [
            {
                div: {
                    schemaId: "div",
                    data: {},
                },
                text: {
                    schemaId: "text",
                    data: "foo",
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
            text: {
                id: "text",
                $id: "text",
                type: "string",
            },
        };
        const messageSystem = new MessageSystem({
            webWorker: "",
        });
        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [],
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
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.navigation,
                    activeDictionaryId: "text",
                },
            } as any);
        });

        expect(monacoAdapter["dictionaryId"]).to.equal("text");
    });
    it("should fire an action when the corresponding id is used", () => {
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
        const runAction = chai.spy(() => {});
        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
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

        monacoAdapter.action("foo").run();

        expect(runAction).to.have.been.called.exactly(1);
    });
    it("should update the monaco value", () => {
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
        const callback = chai.spy(() => {});
        messageSystem.postMessage = callback;
        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "foo",
                    action: config => {
                        config.updateMonacoModelValue(["bar"], false);
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
                    activeDictionaryId: "div",
                },
            } as any);
        });

        monacoAdapter.action("foo").run();

        expect(monacoAdapter["monacoModelValue"]).to.deep.equal(["bar"]);
        expect(callback).to.have.been.called();
    });
    it("should update the monaco value but not send a post message if the source is external", () => {
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
        const callback = chai.spy(() => {});
        messageSystem.postMessage = callback;

        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "foo",
                    action: config => {
                        config.updateMonacoModelValue(["bar"], true);
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
                    activeDictionaryId: "div",
                },
            } as any);
        });

        monacoAdapter.action("foo").run();

        expect(monacoAdapter["monacoModelValue"]).to.deep.equal(["bar"]);
        expect(callback).not.to.have.been.called();
    });
    it("should remove newlines and leading spaces from the monaco model value", () => {
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
        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "foo",
                    action: config => {
                        config.updateMonacoModelValue(["    foo\n   bar"]);
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

        monacoAdapter.action("foo").run();

        expect(monacoAdapter["monacoModelValue"]).to.deep.equal(["foo", "bar"]);
    });
    it("should not update the monaco value if the message is from the adapter", () => {
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
        const callback = chai.spy(() => {});
        new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
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
                        originatorId: monacoAdapterId,
                    },
                },
            } as any);
        });

        expect(callback).not.to.have.been.called();
    });
    it("should update the dataDictionary to correct values when the monaco value has been updated", () => {
        let resolvedDataDictionary: any = null;
        const callback = chai.spy((config: any) => {
            resolvedDataDictionary = config.dataDictionary;
        });
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
        const monacoAdapter = new MonacoAdapter({
            messageSystem,
            actions: [
                new MonacoAdapterAction({
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
                    activeDictionaryId: "div",
                },
            } as any);
        });

        monacoAdapter.action("foo").run();

        const root = resolvedDataDictionary[1];
        const textId =
            resolvedDataDictionary[0][resolvedDataDictionary[1]].data.Slot[0].id;

        expect(resolvedDataDictionary).to.deep.equal([
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

describe("findDictionaryIdParents", () => {
    it("should not return any parents if this is the root dictionary item", () => {
        expect(
            findDictionaryIdParents("root", [
                {
                    root: {
                        schemaId: "text",
                        data: "foo",
                    },
                },
                "root",
            ])
        ).to.deep.equal([]);
    });
    it("should return parents if the dictionary item is nested", () => {
        expect(
            findDictionaryIdParents("a", [
                {
                    root: {
                        schemaId: "bar",
                        data: {
                            Slot: [
                                {
                                    id: "a",
                                },
                            ],
                        },
                    },
                    a: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                },
                "root",
            ])
        ).to.deep.equal([
            {
                id: "root",
                dataLocation: "Slot",
                currentId: "a",
                linkedDataIndex: 0,
            },
        ]);
    });
    it("should return a deeply nested id with multiple items in a slot", () => {
        expect(
            findDictionaryIdParents("c", [
                {
                    root: {
                        schemaId: "bar",
                        data: {
                            Slot: [
                                {
                                    id: "b",
                                },
                                {
                                    id: "a",
                                },
                            ],
                        },
                    },
                    a: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "c",
                                },
                            ],
                        },
                    },
                    b: {
                        schemaId: "foo",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                    c: {
                        schemaId: "foo",
                        parent: {
                            id: "a",
                            dataLocation: "Slot",
                        },
                        data: "foo",
                    },
                },
                "root",
            ])
        ).to.deep.equal([
            {
                id: "root",
                dataLocation: "Slot",
                currentId: "a",
                linkedDataIndex: 1,
            },
            {
                id: "a",
                dataLocation: "Slot",
                currentId: "c",
                linkedDataIndex: 0,
            },
        ]);
    });
});

describe("findUpdatedDictionaryId", () => {
    it("should return the root dictionary id if there is no parent items", () => {
        expect(
            findUpdatedDictionaryId(
                [],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: "bar",
                        },
                    },
                    "foo",
                ]
            )
        ).to.equal("foo");
    });
    it("should return a nested dictionary id if there is a parent item", () => {
        expect(
            findUpdatedDictionaryId(
                [
                    {
                        id: "a",
                        dataLocation: "Slot",
                        currentId: "b",
                        linkedDataIndex: 0,
                    },
                ],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {
                                Slot: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                        },
                        bar: {
                            schemaId: "bar",
                            data: "foo",
                        },
                    },
                    "foo",
                ]
            )
        ).to.equal("bar");
    });
    it("should find the nearest dictionary id if the data structure has changed", () => {
        expect(
            findUpdatedDictionaryId(
                [
                    {
                        id: "a",
                        dataLocation: "Slot",
                        currentId: "b",
                        linkedDataIndex: 0,
                    },
                ],
                [
                    {
                        foo: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "foo",
                ]
            )
        ).to.equal("foo");
    });
});
