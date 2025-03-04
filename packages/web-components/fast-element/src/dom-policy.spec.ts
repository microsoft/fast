import { expect } from "chai";
import { DOMPolicy, DOMPolicyOptions } from "./dom-policy.js";
import { DOM, DOMAspect, DOMSink } from "./dom.js";

describe("the dom policy helper", () => {
    const setProperty = (node, name, value) => node[name] = value;

    it("can create a policy with a custom trusted types policy", () => {
        let invoked = false;
        function createTrustedType() {
            const createHTML = html => {
                invoked = true;
                return html;
            };

            return globalThis.trustedTypes
                ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
                : { createHTML };
        }

        const policy = DOMPolicy.create({ trustedType: createTrustedType() });
        policy.createHTML("Hello world");

        expect(invoked).to.be.true;
    });

    it("can create a policy with custom element guards", () => {
        let created = false;
        let invoked = false;
        const options: DOMPolicyOptions = {
            guards: {
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
                }
            }
        };

        const policy = DOMPolicy.create(options);

        const sink = policy.protect("a", DOMAspect.attribute, "href", DOM.setAttribute);

        expect(created).to.be.true;
        expect(invoked).to.be.false;

        const element = document.createElement("a");
        sink(element, "href", "test");

        expect(element.getAttribute("href")).to.equal("test");
        expect(created).to.be.true;
        expect(invoked).to.be.true;
    });

    it("creates policies that fallback to default element guards", () => {
        let created = 0;
        let invoked = 0;
        const options: DOMPolicyOptions = {
            guards: {
                elements: {
                    "a": {
                        [DOMAspect.attribute]: {
                            href: function safeURL(
                                tagName: string | null,
                                aspect: DOMAspect,
                                aspectName: string,
                                sink: DOMSink
                            ): DOMSink {
                                created++;
                                return (target: Node, name: string, value: string, ...rest: any[]) => {
                                    invoked++;
                                    sink(target, name, value, ...rest);
                                };
                            }
                        }
                    }
                }
            }
        };

        const policy = DOMPolicy.create(options);

        const sink = policy.protect("a", DOMAspect.attribute, "href", DOM.setAttribute);

        expect(created).to.equal(1);
        expect(invoked).to.equal(0);

        const element = document.createElement("a");
        sink(element, "href", "test");

        expect(element.getAttribute("href")).to.equal("test");
        expect(created).to.equal(1);
        expect(invoked).to.equal(1);

        const sink2 = policy.protect("a", DOMAspect.property, "href", setProperty);

        const element2 = document.createElement("a");
        sink2(element2, "href", "https://fast.design/");

        expect(element2.href).to.equal("https://fast.design/");
        expect(created).to.equal(1);
        expect(invoked).to.equal(1);
    });

    it("can create a policy with custom aspect guards", () => {
        let created = false;
        let invoked = false;
        const options: DOMPolicyOptions = {
            guards: {
                aspects: {
                    [DOMAspect.property]: {
                        innerHTML: function safeURL(
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
            }
        };

        const policy = DOMPolicy.create(options);

        const sink = policy.protect("div", DOMAspect.property, "innerHTML", setProperty);

        expect(created).to.be.true;
        expect(invoked).to.be.false;

        const element = document.createElement("div");
        sink(element, "innerHTML", "test");

        expect(element.innerHTML).to.equal("test");
        expect(created).to.be.true;
        expect(invoked).to.be.true;
    });

    it("creates policies that fallback to default aspect guards", () => {
        let created = 0;
        let invoked = 0;
        const options: DOMPolicyOptions = {
            guards: {
                aspects: {
                    [DOMAspect.attribute]: {
                        foo: function safeURL(
                            tagName: string | null,
                            aspect: DOMAspect,
                            aspectName: string,
                            sink: DOMSink
                        ): DOMSink {
                            created++;
                            return (target: Node, name: string, value: string, ...rest: any[]) => {
                                invoked++;
                                sink(target, name, value, ...rest);
                            };
                        }
                    }
                }
            }
        };

        const policy = DOMPolicy.create(options);

        const sink = policy.protect("a", DOMAspect.attribute, "foo", DOM.setAttribute);

        expect(created).to.equal(1);
        expect(invoked).to.equal(0);

        const element = document.createElement("a");
        sink(element, "foo", "test");

        expect(element.getAttribute("foo")).to.equal("test");
        expect(created).to.equal(1);
        expect(invoked).to.equal(1);

        expect(() => {
            policy.protect("div", DOMAspect.property, "innerHTML", setProperty);
        }).to.throw();
    });
});
