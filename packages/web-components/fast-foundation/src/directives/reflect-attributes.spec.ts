import { html, ref, customElement, FASTElement, Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { reflectAttributes } from "./reflect-attributes.js";
import { expect } from "chai";

const template = html<AttributeReflectionTestElement>`
    <div
        ${ref("a")}
        ${reflectAttributes(
            "foo",
            "bar"
        )}
    ></div>
    <div
        ${ref("b")}
        ${reflectAttributes(
            "bar",
            "bat"
        )}
    ></div>
`
const name = uniqueElementName();
@customElement({
    name,
    template
})
class AttributeReflectionTestElement extends FASTElement {
    public a: HTMLElement;
    public b: HTMLElement;
}

describe("reflectAttributes", () => {
    it("should reflect configured attributes that exist on the host after connection", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        element.setAttribute("foo", "bar");
        await connect();

        expect(element.a.getAttribute("foo")).to.equal("bar");
        await disconnect();
    });

    it("should reflect a configured attribute when set on the host to the directive target", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("foo", "bar");
        await Updates.next();

        expect(element.a.getAttribute("foo")).to.equal("bar");
        await disconnect();
    });

    it("should reflect a configured attribute when set on the host to all directive targets", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("bar", "bat");
        await Updates.next();

        expect(element.a.getAttribute("bar")).to.equal("bat");
        expect(element.b.getAttribute("bar")).to.equal("bat");

        await disconnect();
    });

    it("should remove a configured attribute from the directive target when it is removed from the host", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("foo", "bar");
        await Updates.next();

        element.removeAttribute("foo");
        await Updates.next();

        expect(element.a.hasAttribute("foo")).to.equal(false);

        await disconnect();
    });

    it("should remove a configured attribute from all directive targets when it is removed from the host", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("bar", "bat");
        await Updates.next();

        element.removeAttribute("bar");
        await Updates.next();

        expect(element.a.hasAttribute("bar")).to.equal(false);
        expect(element.b.hasAttribute("bar")).to.equal(false);

        await disconnect();
    });

    it("should only reflect attributes in the directive configuration to the directive target", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("foo", "bar");

        await Updates.next();
        expect(element.b.hasAttribute("foo")).to.equal(false);

        await disconnect();
    });

    it("should not reflect attributes thats are not in any directive configuration", async () => {
        const { element, connect, disconnect } = await fixture<AttributeReflectionTestElement>(name);

        await connect();
        element.setAttribute("bee", "bar");
        await Updates.next();

        expect(element.a.hasAttribute("bee")).to.equal(false);
        expect(element.b.hasAttribute("bee")).to.equal(false);

        await disconnect();
    });
})
