import { expect } from "chai";
import { ref } from "./ref.js";
import { html } from "./template.js";

describe("the ref directive", () => {
    class Model {
        reference: HTMLDivElement;
    }

    it("should capture an element reference", () => {
        const template = html<Model>`
            <div id="test" ${ref("reference")}></div>
        `;

        const view = template.create();
        const model = new Model();

        view.bind(model);

        expect(model.reference).instanceOf(HTMLDivElement);
        expect(model.reference.id).equal("test");
    });

    it("should not throw if DOM stringified", () => {
        const template = html<Model>`
            <div id="test" ${ref("reference")}></div>
        `;

        const view = template.create();
        const model = new Model();

        view.bind(model);

        expect(() => {
            JSON.stringify(model.reference);
        }).to.not.throw();
    });
});
