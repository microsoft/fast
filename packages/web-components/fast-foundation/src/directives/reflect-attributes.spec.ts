import { FoundationElement } from "../foundation-element";
import { html, ref, customElement, DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { reflectAttributes } from "./reflect-attributes";
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
const name = "attr-reflection"
@customElement({
    name,
    template
})
class AttributeReflectionTestElement extends FoundationElement {
    public a: HTMLElement;
    public b: HTMLElement;
}


function create() {
    return document.createElement(name) as AttributeReflectionTestElement;
}

function connect(el: HTMLElement) {
    document.body.append(el);

    return () => {
        document.body.removeChild(el);
    }
}
describe("reflectAttributes", () => {
    it("should reflect configured attributes that exist on the host after connection", () => {
        const el = create();
        el.setAttribute("foo", "bar");
        const disconnect = connect(el)
        expect(el.a.getAttribute("foo")).to.equal("bar");
        disconnect();
    });
    it("should reflect a configured attribute when set on the host to the directive target", async () => {
        const el = create();
        const disconnect = connect(el);
        el.setAttribute("foo", "bar");

        await DOM.nextUpdate();
        expect(el.a.getAttribute("foo")).to.equal("bar");
        disconnect();
    });
    it("should reflect a configured attribute when set on the host to all directive targets", async () => {
        const el = create();
        const disconnect = connect(el);
        el.setAttribute("bar", "bat");

        await DOM.nextUpdate();
        expect(el.a.getAttribute("bar")).to.equal("bat");
        expect(el.b.getAttribute("bar")).to.equal("bat");
        disconnect();
    });
    it("should remove a configured attribute from the directive target when it is removed from the host", async () => {
        const el = create();
        const disconnect = connect(el)
        el.setAttribute("foo", "bar");
        await DOM.nextUpdate();

        el.removeAttribute("foo");
        await DOM.nextUpdate();
        expect(el.a.hasAttribute("foo")).to.equal(false);

        disconnect();
    });
    it("should remove a configured attribute from all directive targets when it is removed from the host", async () => {
        const el = create();
        const disconnect = connect(el)
        el.setAttribute("bar", "bat");
        await DOM.nextUpdate();

        el.removeAttribute("bar");
        await DOM.nextUpdate();
        expect(el.a.hasAttribute("bar")).to.equal(false);
        expect(el.b.hasAttribute("bar")).to.equal(false);

        disconnect();
    });

    it("should only reflect attributes in the directive configuration to the directive target", async () => {
        const el = create();
        const disconnect = connect(el);
        el.setAttribute("foo", "bar");

        await DOM.nextUpdate();
        expect(el.b.hasAttribute("foo")).to.equal(false);
        disconnect();
    });
    it("should not reflect attributes thats are not in any directive configuration", async () => {
        const el = create();
        const disconnect = connect(el);
        el.setAttribute("bee", "bar");

        await DOM.nextUpdate();
        expect(el.a.hasAttribute("bee")).to.equal(false);
        expect(el.b.hasAttribute("bee")).to.equal(false);
        disconnect();
    });
})
