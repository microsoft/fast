import { MessageSystem, MessageSystemType, Register } from "../message-system";
import { Shortcuts } from "./shortcuts";
import { ShortcutAction } from "./shortcut-action";

describe("Shortcuts", () => {
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

            new Shortcuts({
                messageSystem,
            });
        }).not.toThrow();
    });
    test("should not throw if the message system is undefined", () => {
        expect(() => {
            new Shortcuts({
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

        new Shortcuts({
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

        const shortcuts: Shortcuts = new Shortcuts({
            messageSystem,
        });

        expect(messageSystem["register"].size).toEqual(1);

        shortcuts.destroy();

        expect(messageSystem["register"].size).toEqual(0);
    });
    test("should add registered actions to a list of actions", () => {
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

        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        metaKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        const shortcuts = new Shortcuts({
            messageSystem,
            actions,
        });

        expect(shortcuts["registeredActions"]).toEqual(actions);
    });
    test("should send a message via the message system that shortcuts have been registered", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        metaKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });

        expect(postMessageCallback).toHaveBeenCalledTimes(1);
        expect(postMessageCallback.mock.calls[0][0].type).toEqual(
            MessageSystemType.custom
        );
        expect(postMessageCallback.mock.calls[0][0].id).toEqual("shortcuts");
        expect(postMessageCallback.mock.calls[0][0].action).toEqual("initialize");
        expect(postMessageCallback.mock.calls[0][0].eventListenerType).toEqual(
            "keypress"
        );
        expect(typeof postMessageCallback.mock.calls[0][0].eventListener).toEqual(
            "function"
        );
        expect(postMessageCallback.mock.calls[0][0].shortcuts.length).toEqual(1);
    });
    test("should pass meta key if meta key is used", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        metaKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ metaKey: true });
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should pass alt key if alt key is used", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        altKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ altKey: true });
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should pass ctrl key if ctrl key is used", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        ctrlKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ ctrlKey: true });
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should pass shift key if shift key is used", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        shiftKey: true,
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ shiftKey: true });
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should pass a specific key if a specific key is used", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "d",
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ key: "d" });
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should not invoke an action if the keys do not match", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "e",
                    },
                ],
                action: shortcutAction,
            }),
        ];
        new Shortcuts({
            messageSystem,
            actions,
        });
        messageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                },
            } as any);
        });
        postMessageCallback.mock.calls[0][0].eventListener({ key: "d" });
        expect(shortcutAction).toHaveBeenCalledTimes(0);
    });
    test("should run an action if the id matches", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "d",
                    },
                ],
                action: shortcutAction,
            }),
            new ShortcutAction({
                id: "bat",
                name: "Bat",
                keys: [
                    {
                        value: "c",
                    },
                ],
                action: shortcutAction,
            }),
        ];
        const shortcuts = new Shortcuts({
            messageSystem,
            actions,
        });
        shortcuts.action("foo").run();
        expect(shortcutAction).toHaveBeenCalledTimes(1);
    });
    test("should not run an action if the id does not match", () => {
        const postMessageCallback: any = jest.fn();
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = jest.fn();
        const actions = [
            new ShortcutAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "d",
                    },
                ],
                action: shortcutAction,
            }),
            new ShortcutAction({
                id: "bat",
                name: "Bat",
                keys: [
                    {
                        value: "c",
                    },
                ],
                action: shortcutAction,
            }),
        ];
        const shortcuts = new Shortcuts({
            messageSystem,
            actions,
        });

        expect(() => {
            shortcuts.action("bar").run();
        }).toThrow();
    });
});
