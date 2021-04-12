import chai, { expect } from "chai";
import spies from "chai-spies";
import MessageSystem from "./message-system";
import { Register } from "./message-system.props";

chai.use(spies);

/* eslint-disable @typescript-eslint/no-empty-function */
describe("MessageSystem", () => {
    it("should not throw when Workers are not available", () => {
        expect(() => {
            (window as any).Worker = void 0;

            new MessageSystem({
                webWorker: "",
            });
        }).not.to.throw();
    });
    it("should not throw when the webWorker is a string", () => {
        class Worker {}

        (window as any).Worker = Worker;

        expect(() => {
            new MessageSystem({
                webWorker: "",
            });
        }).not.to.throw();

        (window as any).Worker = undefined;
    });
    it("should not throw when the webWorker is a Worker instance", () => {
        class Worker {
            constructor(url: string) {
                url;
            }
            public postMessage: undefined;
            public onmessage: undefined;
            public onmessageerror: undefined;
            public onerror: undefined;
            public terminate: undefined;
            public removeEventListener: undefined;
            public addEventListener: undefined;
            public dispatchEvent: undefined;
        }

        (window as any).Worker = Worker;

        expect(() => {
            const myWorker: Worker = new Worker("");

            new MessageSystem({
                webWorker: myWorker as any,
            });
        }).not.to.throw();

        (window as any).Worker = undefined;
    });
    it("should not throw when attempting to initialize and Workers are not available", () => {
        const messageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
        });

        expect(() => {
            messageSystem.initialize({
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
        }).not.to.throw();
    });
    it("should send an initialization message when Workers are available", () => {
        const postMessageCallback: any = chai.spy(() => {});
        class Worker {
            public postMessage: any = postMessageCallback;
        }
        (window as any).Worker = Worker;

        const messageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
        });

        messageSystem.initialize({
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

        expect(postMessageCallback).to.have.been.called.exactly(1);
    });
    it("should add an item to the register", () => {
        const messageSystem: MessageSystem = new MessageSystem({
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

        messageSystem.add({
            onMessage: () => {},
        });

        expect(messageSystem["register"].size).to.equal(1);
    });
    it("should remove an item from the register", () => {
        const messageSystem: MessageSystem = new MessageSystem({
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
        const config: any = {
            onMessage: () => {},
        };

        messageSystem.add(config);

        expect(messageSystem["register"].size).to.equal(1);

        messageSystem.remove(config);

        expect(messageSystem["register"].size).to.equal(0);
    });
    it("should add a worker if there is a Worker available on the window", () => {
        class Worker {
            public postMessage = (): void => void 0;
        }
        (window as any).Worker = Worker;

        const messageSystem: MessageSystem = new MessageSystem({
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

        expect(messageSystem["worker"] instanceof Worker).to.equal(true);
    });
    it("should post a message when the postMessage method is called", () => {
        const postMessageCallback: any = chai.spy(() => {});
        class Worker {
            public postMessage: any = postMessageCallback;
        }
        (window as any).Worker = Worker;

        expect(postMessageCallback).to.have.been.called.exactly(0);

        const messageSystem: MessageSystem = new MessageSystem({
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

        expect(postMessageCallback).to.have.been.called.exactly(1);

        messageSystem.postMessage({
            data: "foo",
        } as any);

        expect(postMessageCallback).to.have.been.called.exactly(2);
    });
    it("should not post a message when the postMessage method is called if workers are not available", () => {
        const postMessageCallback: any = chai.spy(() => {});
        class Worker {
            public postMessage: any = postMessageCallback;
        }
        (window as any).Worker = undefined;
        const myWorker: Worker = new Worker();

        const messageSystem: MessageSystem = new MessageSystem({
            webWorker: myWorker as any,
        });

        messageSystem["worker"] = undefined;
        messageSystem.postMessage({
            data: "foo",
        } as any);

        expect(postMessageCallback).to.have.been.called.exactly(0);
    });
    it("should post a message when the onmessage of the worker has been called", () => {
        const postMessageCallback: any = () => {};
        const onMessageCallback: any = () => {};
        const registeredCallback: any = chai.spy(() => {});
        class Worker {
            public postMessage: any = postMessageCallback;
            public onmessage: any = onMessageCallback;
        }
        (window as any).Worker = Worker;

        const messageSystem: MessageSystem = new MessageSystem({
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

        messageSystem.add({
            onMessage: registeredCallback,
        });

        expect(registeredCallback).to.have.been.called.exactly(0);

        messageSystem["onMessage"]({ data: "foo" } as any);

        expect(registeredCallback).to.have.been.called.exactly(1);
    });
    it("should set the limit on history items if the historyLimit is set", () => {
        class Worker {}
        (window as any).Worker = Worker;

        const messageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            historyLimit: 10,
        });

        expect(messageSystem["historyLimit"]).to.equal(10);
    });
    it("should update the limit on history items if the historyLimit is set again", () => {
        const postMessageCallback: any = () => {};
        class Worker {
            public postMessage: any = postMessageCallback;
        }
        (window as any).Worker = Worker;

        const messageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            historyLimit: 10,
        });
        messageSystem.initialize({
            schemaDictionary: {},
            historyLimit: 5,
        });

        expect(messageSystem["historyLimit"]).to.equal(5);
    });
    it("should get a config if a registered item with a corresponding id is present", () => {
        const messageSystem: MessageSystem = new MessageSystem({
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
        const id: string = "foo";
        const data: any = {
            data: "bar",
        };
        const config: Register = {
            id,
            onMessage: () => {},
            config: data,
        };

        messageSystem.add(config);

        expect(messageSystem["register"].size).to.equal(1);
        expect(messageSystem.getConfigById(id)).to.equal(data);
    });
    it("should return null if no registered item with a corresponding id is present", () => {
        const messageSystem: MessageSystem = new MessageSystem({
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
        const id: string = "foo";
        const data: any = {
            data: "bar",
        };
        const config: Register = {
            id,
            onMessage: () => {},
            config: data,
        };

        messageSystem.add(config);

        expect(messageSystem["register"].size).to.equal(1);
        expect(messageSystem.getConfigById("qux")).to.equal(null);
    });
});
