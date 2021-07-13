import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { listboxOptionTemplate } from "../listbox-option/listbox-option.template";
import { fixture } from "../test-utilities/fixture";
import { ListboxOption } from "./listbox-option";

const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
})

describe("ListboxOption", function() {
    beforeEach(async function() {
        this.fixture = await fixture(FASTOption());
    });

    it("should set the `aria-selected` attribute to match the `selected` property", async function() {
        const { element, connect, disconnect } = this.fixture;

        element.setAttribute("selected", "");

        await connect();

        await DOM.nextUpdate();

        console.log(element.getAttribute("aria-selected"));

        expect(element.getAttribute("aria-selected")).to.equal("true");

        element.selected = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-selected")).to.equal("false");

        await disconnect();
    });

    describe("when in a parent with a role of listbox", function() {
        beforeEach(function() {
            const { parent } = this.fixture;
            parent.setAttribute("role", "listbox");
        });

        describe("in single-selection mode", function() {
            it("should NOT set the `checked` property when connected", async function() {
                const { connect, element, disconnect } = this.fixture;

                await connect();

                expect(element.checked).to.be.undefined;

                await disconnect();
            });

            it("should NOT set the `aria-checked` attribute when connected", async function() {
                const { connect, element, disconnect } = this.fixture;

                await connect();

                expect(element.getAttribute("aria-checked")).to.be.null;

                await disconnect();
            });
        });

        describe("in multiple-selection mode", function() {
            beforeEach(function() {
                const { parent } = this.fixture;
                parent.setAttribute("multiple", "");
            });

            it("should set the `checked` property to false when connected", async function() {
                const { connect, element, disconnect } = this.fixture;

                await connect();

                expect(element.checked).to.be.false;

                await disconnect();
            });

            it("should set the `aria-checked` attribute to match the `checked` property", async function() {
                const { element, connect, disconnect } = this.fixture;

                await connect();

                await DOM.nextUpdate();

                expect(element.getAttribute("aria-checked")).to.equal("false");

                element.checked = true;

                await DOM.nextUpdate();

                expect(element.getAttribute("aria-checked")).to.equal("true");

                await disconnect();
            });

            it("should set the `aria-checked` attribute to false when connected", async function() {
                const { element, connect, disconnect } = this.fixture;

                await connect();

                await DOM.nextUpdate();

                expect(element.getAttribute("aria-checked")).to.equal("false");

                await disconnect();
            });
        });
    });
});
