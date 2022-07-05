import { expect } from "chai";
import { ExecutionContext } from "./observable.js";

describe("The ExecutionContext", () => {
    it("has a default", () => {
        const defaultContext = ExecutionContext.default;
        const newContext = ExecutionContext.create();

        expect(defaultContext.constructor).equals(newContext.constructor);
    });

    function createEvent() {
        const detail = { hello: "world" };
        const event = new CustomEvent('my-event', { detail });

        return { event, detail };
    }

    it("can get the current event", () => {
        const { event } = createEvent();

        ExecutionContext.setEvent(event);
        const context = ExecutionContext.create();

        expect(context.event).equals(event);

        ExecutionContext.setEvent(null);
    });

    it("can get the current event detail", () => {
        const { event, detail } = createEvent();

        ExecutionContext.setEvent(event);
        const context = ExecutionContext.create();

        expect(context.eventDetail()).equals(detail);
        expect(context.eventDetail<typeof detail>().hello).equals(detail.hello);

        ExecutionContext.setEvent(null);
    });

    it("can create a child context for a parent source", () => {
        const parentSource = {};
        const parentContext = ExecutionContext.create();
        const childContext = parentContext.createChildContext(parentSource);

        expect(childContext.parent).equals(parentSource);
        expect(childContext.parentContext).equals(parentContext);
    });

    it("can create an item context from a child context", () => {
        const parentSource = {};
        const parentContext = ExecutionContext.create();
        const childContext = parentContext.createChildContext(parentSource);
        const itemContext = childContext.createItemContext(7, 42);

        expect(itemContext.parent).equals(parentSource);
        expect(itemContext.parentContext).equals(parentContext);
        expect(itemContext.index).equals(7);
        expect(itemContext.length).equals(42);
    });

    context("item context", () => {
        const scenarios = [
            {
                name: "even is first",
                index: 0,
                length: 42,
                isEven: true,
                isOdd: false,
                isFirst: true,
                isMiddle: false,
                isLast: false
            },
            {
                name: "odd in middle",
                index: 7,
                length: 42,
                isEven: false,
                isOdd: true,
                isFirst: false,
                isMiddle: true,
                isLast: false
            },
            {
                name: "even in middle",
                index: 8,
                length: 42,
                isEven: true,
                isOdd: false,
                isFirst: false,
                isMiddle: true,
                isLast: false
            },
            {
                name: "odd at end",
                index: 41,
                length: 42,
                isEven: false,
                isOdd: true,
                isFirst: false,
                isMiddle: false,
                isLast: true
            },
            {
                name: "even at end",
                index: 40,
                length: 41,
                isEven: true,
                isOdd: false,
                isFirst: false,
                isMiddle: false,
                isLast: true
            }
        ];

        function assert(itemContext: ExecutionContext, scenario: typeof scenarios[0]) {
            expect(itemContext.index).equals(scenario.index);
            expect(itemContext.length).equals(scenario.length);
            expect(itemContext.isEven).equals(scenario.isEven);
            expect(itemContext.isOdd).equals(scenario.isOdd);
            expect(itemContext.isFirst).equals(scenario.isFirst);
            expect(itemContext.isInMiddle).equals(scenario.isMiddle);
            expect(itemContext.isLast).equals(scenario.isLast);
        }

        for (const scenario of scenarios) {
            it(`has correct position when ${scenario.name}`, () => {
                const parentSource = {};
                const parentContext = ExecutionContext.create();
                const childContext = parentContext.createChildContext(parentSource);
                const itemContext = childContext.createItemContext(scenario.index, scenario.length);

                assert(itemContext, scenario);
            });
        }

        it ("can update its index and length", () => {
            const scenario1 = scenarios[0];
            const scenario2 = scenarios[1];

            const parentSource = {};
            const parentContext = ExecutionContext.create();
            const childContext = parentContext.createChildContext(parentSource);
            const itemContext = childContext.createItemContext(scenario1.index, scenario1.length);

            assert(itemContext, scenario1);

            itemContext.updatePosition(scenario2.index, scenario2.length);

            assert(itemContext, scenario2);
        });
    });
});
