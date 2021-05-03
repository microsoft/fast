import chai, { expect } from "chai";
import spies from "chai-spies";
import { MessageSystem, MessageSystemType, Register } from "../message-system";
import { Shortcuts, ShortcutsConfig, shortcutsId } from "./shortcuts.service";
import { ShortcutsAction } from "./shortcuts.service-action";

chai.use(spies);

/**
 * These tests rely on some async functionality.
 * They are therefore not included with the rest of the coverage
 * and should be run only locally when making changes to the Shortcuts service.
 *
 * TODO: enable these tests #4601
 */
/* eslint-disable @typescript-eslint/no-empty-function */
xdescribe("Shortcuts", () => {
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

            new Shortcuts({
                messageSystem,
            });
        }).not.to.throw();
    });
    it("should not throw if the message system is undefined", () => {
        expect(() => {
            new Shortcuts({
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

        new Shortcuts({
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

        const shortcuts: Shortcuts = new Shortcuts({
            messageSystem,
        });

        expect(messageSystem["register"].size).to.equal(1);

        shortcuts.destroy();

        expect(messageSystem["register"].size).to.equal(0);
    });
    it("should add registered actions to a list of actions", () => {
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

        const shortcutAction = () => {};
        const actions = [
            new ShortcutsAction({
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

        expect(shortcuts["registeredActions"]).to.equal(actions);
    });
    it("should send a message via the message system that shortcuts have been registered", () => {
        let callbackArgs = null;
        const postMessageCallback: any = chai.spy((config: any) => {
            callbackArgs = config;
        });
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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

        expect(postMessageCallback).to.have.been.called.exactly(1);
        expect(callbackArgs.type).to.equal(MessageSystemType.custom);
        expect(callbackArgs.id).to.equal(shortcutsId);
        expect(callbackArgs.action).to.equal("initialize");
    });
    it("should pass meta key if meta key is used", () => {
        const postMessageCallback: any = chai.spy(() => {});
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            metaKey: true,
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should pass alt key if alt key is used", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            altKey: true,
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should pass ctrl key if ctrl key is used", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            ctrlKey: true,
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should pass shift key if shift key is used", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            shiftKey: true,
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should pass a specific key if a specific key is used", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            key: "d",
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should not invoke an action if the keys do not match", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
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
        (messageSystem.getConfigById(shortcutsId) as ShortcutsConfig).eventListener({
            key: "d",
        } as any);
        expect(shortcutAction).to.have.been.called.exactly(0);
    });
    it("should run an action if the id matches", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = chai.spy(() => {});
        const actions = [
            new ShortcutsAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "d",
                    },
                ],
                action: shortcutAction,
            }),
            new ShortcutsAction({
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
        expect(shortcutAction).to.have.been.called.exactly(1);
    });
    it("should not run an action if the id does not match", () => {
        const postMessageCallback: any = () => {};
        const messageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: null,
            schemaDictionary: null,
        });
        messageSystem.postMessage = postMessageCallback;
        const shortcutAction = () => {};
        const actions = [
            new ShortcutsAction({
                id: "foo",
                name: "Foo",
                keys: [
                    {
                        value: "d",
                    },
                ],
                action: shortcutAction,
            }),
            new ShortcutsAction({
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
        }).to.throw();
    });
});
