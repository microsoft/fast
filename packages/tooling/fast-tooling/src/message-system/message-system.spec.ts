import MessageSystem from "./message-system";

describe("MessageSystem", () => {
    test("should not throw when Workers are not available", () => {
        expect(() => {
            new MessageSystem({
                webWorker: "",
            });
        });
    });
    test("should not throw when the webWorker is a string", () => {
        class Worker {}

        (window as any).Worker = Worker;

        expect(() => {
            new MessageSystem({
                webWorker: "",
            });
        }).not.toThrow();

        (window as any).Worker = undefined;
    });
    test("should not throw when the webWorker is a Worker instance", () => {
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
                webWorker: myWorker,
            });
        }).not.toThrow();

        (window as any).Worker = undefined;
    });
    test("should not throw when attempting to initialize and Workers are not available", () => {
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
        }).not.toThrow();
    });
    test("should send an initialization message when Workers are available", () => {
        const postMessageCallback: any = jest.fn();
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

        expect(postMessageCallback).toHaveBeenCalledTimes(1);
    });
    test("should add an item to the register", () => {
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

        expect(messageSystem["register"].size).toEqual(0);

        messageSystem.add({
            onMessage: jest.fn(),
        });

        expect(messageSystem["register"].size).toEqual(1);
    });
    test("should remove an item from the register", () => {
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
            onMessage: jest.fn(),
        };

        messageSystem.add(config);

        expect(messageSystem["register"].size).toEqual(1);

        messageSystem.remove(config);

        expect(messageSystem["register"].size).toEqual(0);
    });
    test("should add a worker if there is a Worker available on the window", () => {
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

        expect(messageSystem["worker"] instanceof Worker).toEqual(true);
    });
    test("should post a message when the postMessage method is called", () => {
        const postMessageCallback: any = jest.fn();
        class Worker {
            public postMessage: any = postMessageCallback;
        }
        (window as any).Worker = Worker;

        expect(postMessageCallback).toHaveBeenCalledTimes(0);

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

        expect(postMessageCallback).toHaveBeenCalledTimes(1);

        messageSystem.postMessage({
            data: "foo",
        } as any);

        expect(postMessageCallback).toHaveBeenCalledTimes(2);
    });
    test("should post a message when the onmessage of the worker has been called", () => {
        const postMessageCallback: any = jest.fn();
        const onMessageCallback: any = jest.fn();
        const registeredCallback: any = jest.fn();
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

        expect(registeredCallback).toHaveBeenCalledTimes(0);

        messageSystem["onMessage"]({ data: "foo" } as any);

        expect(registeredCallback).toHaveBeenCalledTimes(1);
    });
});
