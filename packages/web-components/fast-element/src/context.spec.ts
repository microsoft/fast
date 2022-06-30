import { expect } from "chai";
import { Context } from "./context.js";
import { uniqueElementName } from "./testing/fixture.js";

describe("Context", () => {
    describe(`create()`, () => {
        it(`returns a context that has the specified name`, () => {
            const TestContext = Context.create("TestContext");

            expect(TestContext.name).equal("TestContext");
        });

        it(`returns a context that stringifies its name`, () => {
            const TestContext = Context.create("TestContext");
            const expected = "Context<TestContext>";

            expect(TestContext.toString()).equal(expected);
            expect(String(TestContext)).equal(expected);
            expect(`${TestContext}`).equal(expected);
        });

        it(`returns a context that gets the initial value if not handled`, () => {
            const initialValue = "hello world";
            const TestContext = Context.create("TestContext", initialValue);

            const node = document.createElement("div");
            const value = TestContext.get(node);

            expect(value).equal(initialValue);
        });

        it(`returns a context that can be used for a protocol request`, () => {
            const value = "hello world";
            const TestContext = Context.create("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            TestContext.handle(parent, event => {
                if (event.context === TestContext) {
                    event.stopImmediatePropagation();
                    event.callback(value);
                }
            });

            let capture;
            TestContext.request(child, response => capture = response);

            expect(capture).equal(value);
        });

        it(`returns a context that can be used for a get request`, () => {
            const value = "hello world";
            const TestContext = Context.create("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            TestContext.handle(parent, event => {
                if (event.context === TestContext) {
                    event.stopImmediatePropagation();
                    event.callback(value);
                }
            });

            const capture = TestContext.get(child);

            expect(capture).equal(value);
        });

        it(`returns a context that can be used to provide a value`, () => {
            const value = "hello world";
            const TestContext = Context.create("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            TestContext.provide(parent, value);

            const capture = TestContext.get(child);

            expect(capture).equal(value);
        });

        it(`returns a context that can be used as a decorator`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const elementName = uniqueElementName();

            class TestElement extends HTMLElement {
                @TestContext test: string;
            }

            customElements.define(elementName, TestElement);

            const parent = document.createElement("div");
            const child = document.createElement(elementName) as TestElement;
            parent.append(child);

            TestContext.handle(parent, event => {
                if (event.context === TestContext) {
                    event.stopImmediatePropagation();
                    event.callback(value);
                }
            });

            expect(child.test).equal(value);
        });
    });

    describe(`get()`, () => {
        it(`gets the value for a context`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.handle(parent, event => {
                event.stopImmediatePropagation();
                event.callback(value);
            }, TestContext);

            const capture = Context.get(child, TestContext);

            expect(capture).equal(value);
        });
    });

    describe(`request()`, () => {
        it(`makes a protocol request`, () => {
            const value = "hello world";
            const TestContext = Context.create("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.handle(parent, event => {
                event.stopImmediatePropagation();
                event.callback(value);
            }, TestContext);

            let capture;
            Context.request(child, TestContext, response => capture = response);

            expect(capture).equal(value);
        });
    });

    describe(`provide()`, () => {
        it(`configures a context value without callbacks`, () => {
            const value = "hello world";
            const TestContext = Context.create("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.provide(parent, TestContext, value);

            let capture = Context.get(child, TestContext);

            expect(capture).equal(value);
        });
    });

    describe(`dispatch()`, () => {
        it(`dispatches an event even when the request strategy has been changed`, () => {
            const wrongValue = "hello world";
            const rightValue = "bye bye";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.setDefaultRequestStrategy((target, context, callback) => {
                callback(wrongValue as any);
            });

            Context.handle(parent, event => {
                event.stopImmediatePropagation();
                event.callback(rightValue);
            }, TestContext);

            let capture;

            Context.dispatch(parent, TestContext, value => {
                capture = value;
            });

            expect(capture).equal(rightValue);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });
    });

    describe(`defineProperty()`, () => {
        it(`defines a property on a target that returns the context value`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");

            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.defineProperty(child, "test", TestContext);

            TestContext.handle(parent, event => {
                if (event.context === TestContext) {
                    event.stopImmediatePropagation();
                    event.callback(value);
                }
            });

            expect((child as any).test).equal(value);
        });
    });

    describe(`setDefaultRequestStrategy()`, () => {
        it(`changes how request() works`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.setDefaultRequestStrategy((target, context, callback) => {
                callback(value as any);
            });

            let capture;

            Context.request(parent, TestContext, response => {
                capture = response;
            });

            expect(capture).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`changes how get() works`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.setDefaultRequestStrategy((target, context, callback) => {
                callback(value as any);
            });

            let capture = Context.get(child, TestContext);

            expect(capture).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`changes how defineProperty() works`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.append(child);

            Context.setDefaultRequestStrategy((target, context, callback) => {
                callback(value as any);
            });

            Context.defineProperty(child, "test", TestContext);

            expect((child as any).test).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });

        it(`changes how context decorators work`, () => {
            const value = "hello world";
            const TestContext = Context.create<string>("TestContext");
            const elementName = uniqueElementName();

            class TestElement extends HTMLElement {
                @TestContext test: string;
            }

            customElements.define(elementName, TestElement);

            const parent = document.createElement("div");
            const child = document.createElement(elementName) as TestElement;
            parent.append(child);

            Context.setDefaultRequestStrategy((target, context, callback) => {
                callback(value as any);
            });

            expect(child.test).equal(value);

            Context.setDefaultRequestStrategy(Context.dispatch);
        });
    });
});
