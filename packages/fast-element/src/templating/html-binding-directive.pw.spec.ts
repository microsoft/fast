import { expect, test } from "@playwright/test";

test.describe("HTMLBindingDirective", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("clears the current event when the event handler throws", async ({ page }) => {
        const {
            defaultPrevented,
            eventAvailableDuringHandler,
            eventClearedAfterThrow,
            threw,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                HTMLBindingDirective,
                HTMLDirective,
                ExecutionContext,
                Fake,
                DOM,
                nextId,
                listener,
            } = await import("/main.js");

            class Model {
                eventAvailableDuringHandler = false;

                invokeAction(context: any) {
                    this.eventAvailableDuringHandler =
                        context.event === ExecutionContext.getEvent();
                    throw new Error("Event handler failed.");
                }
            }

            const directive = new HTMLBindingDirective(
                listener((x: Model, c: any) => x.invokeAction(c), {}),
            );
            HTMLDirective.assignAspect(directive, "@my-event");

            const node = document.createElement("div");
            directive.id = nextId();
            directive.targetNodeId = "r";
            directive.targetTagName = node.tagName ?? null;
            directive.policy = DOM.policy;

            const targets = { r: node };
            const behavior = directive.createBehavior();
            const controller = Fake.viewController(targets, behavior);
            const model = new Model();
            controller.bind(model);

            const event = new CustomEvent("my-event", { cancelable: true });
            Object.defineProperty(event, "currentTarget", { value: node });

            let threw = false;

            try {
                directive.handleEvent(event);
            } catch {
                threw = true;
            }

            return {
                defaultPrevented: event.defaultPrevented,
                eventAvailableDuringHandler: model.eventAvailableDuringHandler,
                eventClearedAfterThrow: ExecutionContext.getEvent() === null,
                threw,
            };
        });

        expect(threw).toBe(true);
        expect(eventAvailableDuringHandler).toBe(true);
        expect(eventClearedAfterThrow).toBe(true);
        expect(defaultPrevented).toBe(false);
    });
});
