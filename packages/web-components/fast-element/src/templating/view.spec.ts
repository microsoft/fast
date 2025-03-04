import { expect } from "chai";
import { Message } from "../interfaces.js";
import { ExecutionContext } from "../observation/observable.js";
import { FAST } from "../platform.js";
import { AddViewBehaviorFactory, HTMLDirective, ViewBehavior, ViewBehaviorFactory, ViewController } from "./html-directive.js";
import { Markup } from "./markup.js";
import { html } from "./template.js";
import { HTMLView } from "./view.js";

function startCapturingWarnings() {
    const currentWarn = FAST.warn;
    const list: { code: number, values?: Record<string, any> }[] = [];

    FAST.warn = function(code, values) {
        list.push({ code, values });
    }

    return {
        list,
        dispose() {
            FAST.warn = currentWarn;
        }
    };
}

describe(`The HTMLView`, () => {
    context("when binding hosts", () => {
        it("gracefully handles empty template elements", () => {
            const template = html`
                <template></template>
            `;

            const view = template.create();
            view.bind({});

            expect(view.firstChild).not.to.be.null;
            expect(view.lastChild).not.to.be.null;
        });
        it("gracefully handles empty template literals", () => {
            const template = html``;

            const view = template.create();
            view.bind({});

            expect(view.firstChild).not.to.be.null;
            expect(view.lastChild).not.to.be.null;
        });
        it("warns on class bindings when host not present", () => {
            const template = html`
                <template class="foo"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("setAttribute");
        });

        it("warns on style bindings when host not present", () => {
            const template = html`
                <template style="color: red"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("setAttribute");
        });

        it("warns on boolean bindings when host not present", () => {
            const template = html`
                <template ?disabled="${() => false}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("removeAttribute");
        });

        it("warns on property bindings when host not present", () => {
            const template = html`
                <template :myProperty="${() => false}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("myProperty");
        });

        it("warns on className bindings when host not present", () => {
            const template = html`
                <template :className="${() => "test"}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("className");
        });

        it("warns on event bindings when host not present", () => {
            const template = html`
                <template @click="${() => void 0}"></template>
            `;

            const warnings = startCapturingWarnings();
            const view = template.create();
            view.bind({});
            warnings.dispose();

            expect(warnings.list.length).equal(1);
            expect(warnings.list[0].code).equal(Message.hostBindingWithoutHost);
            expect(warnings.list[0].values!.name).equal("addEventListener");
        });
    });

    context("when rebinding", () => {
        it("properly unbinds the old source before binding the new source", () => {
            const sources: any[] = [];
            const boundStates: boolean[] = [];

            class SourceCaptureDirective
                implements HTMLDirective, ViewBehaviorFactory, ViewBehavior {
                id: string;
                nodeId: string;

                createHTML(add: AddViewBehaviorFactory): string {
                    return Markup.attribute(add(this));
                }

                createBehavior(): ViewBehavior<any, any> {
                    return this;
                }

                bind(controller: ViewController<any, any>): void {
                    sources.push(controller.source);
                    boundStates.push(controller.isBound);
                }
            }

            HTMLDirective.define(SourceCaptureDirective);

            const template = html`
                <div ${new SourceCaptureDirective()}></div>
            `;

            const view = template.create();
            const firstSource = {};
            view.bind(firstSource);

            const secondSource = {};
            view.bind(secondSource);

            expect(sources[0]).to.equal(firstSource);
            expect(boundStates[0]).to.be.false;

            expect(sources[1]).to.equal(secondSource);
            expect(boundStates[1]).to.be.false;
        });
    });

    context("execution context", () => {
        function createEvent() {
            const detail = { hello: "world" };
            const event = new CustomEvent('my-event', { detail });

            return { event, detail };
        }

        function createView() {
            return new HTMLView(
                document.createDocumentFragment(),
                [],
                {}
            );
        }

        it("can get the current event", () => {
            const { event } = createEvent();
            const view = createView();
            const context = view.context;

            ExecutionContext.setEvent(event);

            expect(context.event).equals(event);

            ExecutionContext.setEvent(null);
        });

        it("can get the current event detail", () => {
            const { event, detail } = createEvent();
            const view = createView();
            const context = view.context;

            ExecutionContext.setEvent(event);

            expect(context.eventDetail()).equals(detail);
            expect(context.eventDetail<typeof detail>().hello).equals(detail.hello);

            ExecutionContext.setEvent(null);
        });

        it("can connect a child context to a parent source", () => {
            const parentSource = {};
            const parentView = createView();
            const parentContext = parentView.context;
            const childView = createView();
            const childContext = childView.context;

            childContext.parent = parentSource;
            childContext.parentContext = parentContext;

            expect(childContext.parent).equals(parentSource);
            expect(childContext.parentContext).equals(parentContext);
        });

        it("can create an item context from a child context", () => {
            const parentSource = {};
            const parentView = createView();
            const parentContext = parentView.context;
            const itemView = createView();
            const itemContext = itemView.context;

            itemContext.parent = parentSource;
            itemContext.parentContext = parentContext;
            itemContext.index = 7;
            itemContext.length = 42;

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
                    const parentView = createView();
                    const parentContext = parentView.context;
                    const itemView = createView();
                    const itemContext = itemView.context;

                    itemContext.parent = parentSource;
                    itemContext.parentContext = parentContext;
                    itemContext.index = scenario.index;
                    itemContext.length = scenario.length;

                    assert(itemContext, scenario);
                });
            }

            it ("can update its index and length", () => {
                const scenario1 = scenarios[0];
                const scenario2 = scenarios[1];

                const parentSource = {};
                const parentView = createView();
                const parentContext = parentView.context;
                const itemView = createView();
                const itemContext = itemView.context;

                itemContext.parent = parentSource;
                itemContext.parentContext = parentContext;
                itemContext.index = scenario1.index;
                itemContext.length = scenario1.length;

                assert(itemContext, scenario1);

                itemContext.index = scenario2.index;
                itemContext.length = scenario2.length;

                assert(itemContext, scenario2);
            });
        });
    });
});
