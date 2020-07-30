import { expect } from "chai";
import { customElement, html, DOM } from "@microsoft/fast-element";
import { classNames } from "@microsoft/fast-web-utilities";
import { Button } from "./button";

@customElement({
    name: "test-button",
    template: html`
        <slot></slot>
    `,
})
class TestElement extends Button {}

describe("Button", () => {
    describe("of type 'submit'", () => {
        it("should submit the parent form when clicked", () => {
            let wasSumbitted = false;
            let event: any;
            const form = document.createElement("form");
            const submit = document.createElement("test-button");
            submit.setAttribute("type", "submit");
            form.appendChild(submit);
            form.addEventListener("submit", e => {
                e.preventDefault();
                wasSumbitted = true;
                event = e;
            });
            document.body.appendChild(form);

            submit.click();

            expect(wasSumbitted).to.equal(true);
            expect(event.submitter).to.equal(submit["proxy"] as any);
        });
    });

    describe("of type 'reset'", () => {
        it("should submit the parent form when clicked", () => {
            let wasReset = false;
            const form = document.createElement("form");
            const reset = document.createElement("test-button");
            reset.setAttribute("type", "reset");
            form.appendChild(reset);
            document.body.appendChild(form);
            form.addEventListener("reset", () => {
                wasReset = true;
            });

            reset.click();

            expect(wasReset).to.equal(true);
        });
    });
});
