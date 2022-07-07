import { expect } from "chai";
import { FASTTreeItem, treeItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";

const TreeItem = FASTTreeItem.define({
    name: uniqueElementName("tree-item"),
    template: treeItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture(TreeItem);

    return { element, connect, disconnect };
}

// TODO: Need to add tests for keyboard handling & focus management
describe("TreeItem", () => {
    it("should include a role of `treeitem`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("treeitem");

        await disconnect();
    });

    it("should set the `aria-expanded` attribute equal to the `expanded` value when the tree item has children", async () => {
        const { element, connect, disconnect } = await setup();
        const child = new TreeItem();

        element.appendChild(child);
        element.expanded = true;

        await connect();
        await Updates.next();

        expect(element.getAttribute("aria-expanded")).to.equal("true");

        await disconnect();
    });

    it("should NOT set the `aria-expanded` attribute if the tree item has no children", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal(null);

        await disconnect();
    });

    it("should NOT set the `aria-expanded` attribute if `expanded` value is true but the tree item has no children", async () => {
        const { element, connect, disconnect } = await setup();
        element.expanded = true;

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal(null);

        await disconnect();
    });

    it("should add a class of `expanded` when expanded is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = true;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(true);

        await disconnect();
    });

    it("should set the `aria-selected` attribute equal to the `selected` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.selected = true;

        await connect();

        expect(element.getAttribute("aria-selected")).to.equal("true");

        element.selected = false;

        await Updates.next();

        expect(element.getAttribute("aria-selected")).to.equal("false");

        await disconnect();
    });

    it("should NOT set the `aria-selected` attribute if `selected` value is not provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hasAttribute("aria-selected")).to.equal(false);

        await disconnect();
    });

    it("should add a class of `selected` when selected is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.selected = true;

        await connect();

        expect(element.classList.contains("selected")).to.equal(true);

        await disconnect();
    });

    it("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        element.disabled = false;

        await Updates.next();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should NOT set the `aria-disabled` attribute if `disabled` value is not provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hasAttribute("aria-disabled")).to.equal(false);

        await disconnect();
    });

    it("should add a class of `disabled` when disabled is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.classList.contains("disabled")).to.equal(true);

        await disconnect();
    });

    it("should add a slot attribute of `item` to nested tree items", async () => {
        const { element, connect, disconnect } = await setup();
        const nestedItem = new TreeItem();

        element.appendChild(nestedItem);

        await connect();

        expect(nestedItem.getAttribute("slot")).to.equal("item");

        await disconnect();
    });

    it("should add a class of `nested` when nested is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.nested = true;

        await connect();

        expect(element.classList.contains("nested")).to.equal(true);

        await disconnect();
    });

    it("should set a tabindex of -1", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(true);
        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should set a tabindex of 0 when focused", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.focus();
        await Updates.next();
        expect(element.hasAttribute("tabindex")).to.equal(true);
        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should render an element with a class of `expand-collapse-button` when nested tree items exist", async () => {
        const { element, connect, disconnect } = await setup();
        const nestedItem = new TreeItem();

        element.appendChild(nestedItem);

        await connect();
        await Updates.next();
        expect(element.shadowRoot?.querySelector(".expand-collapse-button")).to.exist;

        await disconnect();
    });

    it("should include an aria-hidden attribute on the `expand-collapse-button`", async () => {
        const { element, connect, disconnect } = await setup();
        const nestedItem = new TreeItem();

        element.appendChild(nestedItem);

        await connect();
        await Updates.next();

        let button = element.shadowRoot?.querySelector(".expand-collapse-button");

        expect(button?.getAttribute("aria-hidden")).to.equal("true");

        await disconnect();
    });

    it("should render an element with a role of `group` when nested tree items exist and expanded is true", async () => {
        const { element, connect, disconnect } = await setup();
        const nestedItem = new TreeItem();

        element.appendChild(nestedItem);
        element.expanded = true;

        await connect();
        await Updates.next();

        expect(
            element.shadowRoot?.querySelector(".items")?.getAttribute("role")
        ).to.equal("group");

        await disconnect();
    });

    it("should NOT render an element with a role of `group` when nested tree items exist and expanded is false", async () => {
        const { element, connect, disconnect } = await setup();
        const nestedItem = new TreeItem();

        element.appendChild(nestedItem);

        await connect();
        await Updates.next();

        expect(element.shadowRoot?.querySelector(".items")).not.to.exist;

        await disconnect();
    });

    describe("events", () => {
        it("should fire a change event when expanded changes", async () => {
            const { element, connect, disconnect } = await setup();
            const nestedItem = new TreeItem();
            element.appendChild(nestedItem);

            let wasClicked = false;

            element.addEventListener("expanded-change", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await connect();
            await Updates.next();

            let button = element.shadowRoot?.querySelector(
                ".expand-collapse-button"
            ) as any;
            button?.click();

            await Updates.next();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should toggle the expanded state when `expand-collapse-button` is clicked", async () => {
            const { element, connect, disconnect } = await setup();
            const nestedItem = new TreeItem();

            element.appendChild(nestedItem);

            await connect();
            await Updates.next();

            let button = element.shadowRoot?.querySelector(
                ".expand-collapse-button"
            ) as any;
            button?.click();

            await Updates.next();

            expect(element.expanded).to.equal(true);
            expect(element.getAttribute("aria-expanded")).to.equal("true");

            button?.click();

            await Updates.next();

            expect(element.expanded).to.equal(false);
            expect(element.getAttribute("aria-expanded")).to.equal("false");

            await disconnect();
        });

        it("should fire a selected change event when selected changes", async () => {
            const { element, connect, disconnect } = await setup();
            const nestedItem = new TreeItem();
            element.appendChild(nestedItem);

            let wasSelected = false;

            element.addEventListener("selected-change", e => {
                e.preventDefault();

                wasSelected = true;
            });

            await connect();

            element.setAttribute("selected", "true");
            await Updates.next();

            expect(wasSelected).to.equal(true);

            await disconnect();
        });

        it("should NOT set selected state when the element is clicked when disabled", async () => {
            const { element, connect, disconnect } = await setup();
            const nestedItem = new TreeItem();

            element.appendChild(nestedItem);
            element.disabled = true;

            await connect();
            await Updates.next();

            element.click();

            await Updates.next();

            expect(element.selected).to.not.equal(true);
            expect(element.getAttribute("aria-selected")).to.equal(null);

            await disconnect();
        });

        it("should fire an event when expanded state changes", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            const wasExpanded = await new Promise(resolve => {
                element.addEventListener("expanded-change", () => resolve(true));

                element.setAttribute("expanded", "true");

                Updates.enqueue(() => resolve(false));
            });

            expect(wasExpanded).to.equal(true);

            await disconnect();
        });

        it("should fire an event when selected state changes", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            const wasSelected = await new Promise(resolve => {
                element.addEventListener("selected-change", () => resolve(true));

                element.setAttribute("selected", "true");

                Updates.enqueue(() => resolve(false));
            });

            expect(wasSelected).to.equal(true);

            await disconnect();
        });
    });
});
