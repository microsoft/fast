import { expect } from "chai";
import { attr } from "../components/attributes.js";
import { customElement, FASTElement } from "../components/fast-element.js";
import { observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";
import { html } from "../templating/template.js";
import { uniqueElementName, fixture } from "./fixture.js";

describe("The fixture helper", () => {
    const name = uniqueElementName();
    const template = html<MyElement>`
        ${x => x.value}
        <slot></slot>
    `;

    @customElement({
        name,
        template,
    })
    class MyElement extends FASTElement {
        @attr value = "value";
    }

    class MyModel {
        @observable value = "different value";
    }

    it("can create a fixture for an element by name", async () => {
        const { element } = await fixture(name);
        expect(element).to.be.instanceOf(MyElement);
    });

    it("can create a fixture for an element by template", async () => {
        const { element } = await fixture(html`
      <${name}>
        Some content here.
      </${name}>
    `);

        expect(element).to.be.instanceOf(MyElement);
        expect(element.innerText.trim()).to.equal("Some content here.");
    });

    it("can connect an element", async () => {
        const { element, connect } = await fixture(name);

        expect(element.isConnected).to.equal(false);

        await connect();

        expect(element.isConnected).to.equal(true);

        document.body.removeChild(element.parentElement!);
    });

    it("can disconnect an element", async () => {
        const { element, connect, disconnect } = await fixture(name);

        expect(element.isConnected).to.equal(false);

        await connect();

        expect(element.isConnected).to.equal(true);

        await disconnect();

        expect(element.isConnected).to.equal(false);
    });

    it("can bind an element to data", async () => {
        const source = new MyModel();
        const { element, disconnect } = await fixture<MyElement>(
            html<MyModel>`
      <${name} value=${x => x.value}></${name}>
    `,
            { source }
        );

        expect(element.value).to.equal(source.value);

        source.value = "something else";

        await Updates.next();

        expect(element.value).to.equal(source.value);

        await disconnect();
    });
});
