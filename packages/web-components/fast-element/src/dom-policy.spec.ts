import { expect } from "chai";
import { DOMPolicy } from "./dom-policy.js";
import { DOMAspect, DOMSink } from "./dom.js";

describe("the dom policy helper", () => {
    it("can create a policy with a custom trusted types policy", () => {
        let invoked = false;
        const custom = globalThis.trustedTypes.createPolicy(
            "fast-html",
            {
                createHTML(html: string) {
                    invoked = true;
                    return html;
                }
            }
        );

        const policy = DOMPolicy.create(custom);
        policy.createHTML("Hello world");

        expect(invoked).to.be.true;
    });

    it("can create a policy with custom element guards", () => {
        let created = false;
        let invoked = false;
        const policy = DOMPolicy.create(void 0, {
            elements: {
                "a": {
                    [DOMAspect.attribute]: {
                        href: function safeURL(
                            tagName: string | null,
                            aspect: DOMAspect,
                            aspectName: string,
                            sink: DOMSink
                        ): DOMSink {
                            created = true;
                            return (target: Node, name: string, value: string, ...rest: any[]) => {
                                invoked = true;
                                sink(target, name, value, ...rest);
                            };
                        }
                    }
                }
            },
            aspects: {}
        });

        const sink = policy.protect("a", DOMAspect.attribute, "href", () => {});

        expect(created).to.be.true;
        expect(invoked).to.be.false;

        sink(document.createElement("a"), "a", "test");

        expect(created).to.be.true;
        expect(invoked).to.be.true;
    });
});
