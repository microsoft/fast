import MessageSystem from "./message-system";

describe("MessageSystem", () => {
    test("should not throw", () => {
        expect(() => {
            new MessageSystem({
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
        });
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
