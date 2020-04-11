import MessageSystem from "./message-system";

/* tslint:disable:max-classes-per-file */
describe("MessageSystem", () => {
    test("should not throw", () => {
        expect(() => {
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

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(0);

        messageSystem.add({
            onMessage: jest.fn(),
        });

        /* tslint:disable-next-line */
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

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(1);

        messageSystem.remove(config);

        /* tslint:disable-next-line */
        expect(messageSystem["register"].size).toEqual(0);
    });
    test("should add a worker if there is a Worker available on the window", () => {
        class Worker {
            /* tslint:disable-next-line */
            public postMessage = (): void => {};
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

        /* tslint:disable-next-line */
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

        /* tslint:disable-next-line */
        messageSystem["onMessage"]({ data: "foo" } as any);

        expect(registeredCallback).toHaveBeenCalledTimes(1);
    });
});
