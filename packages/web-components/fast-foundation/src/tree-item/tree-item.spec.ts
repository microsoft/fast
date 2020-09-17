import { expect } from "chai";
import { TreeItem, TreeItemTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { Button } from "../button";

@customElement({
    name: "fast-tree-item",
    template,
})
class FASTTreeItem extends TreeItem {}

// TODO: Need to add tests for keyboard handling & focus management
describe("TreeItem", () => {
    it("should include a role of `treeitem`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal("treeitem");

        await disconnect();
    });

    it("should set the `aria-expanded` attribute equal when `expanded` value is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.expanded = true;

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal("true");

        await disconnect();
    });

    it("should NOT set the `aria-expanded` attribute if `expanded` value is not provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal(null);

        await disconnect();
    });

    it("should add a class of `expanded` when expanded is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.expanded = true;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(true);

        await disconnect();
    });

    it("should set the `aria-selected` attribute equal to the `selected` value", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.selected = true;

        await connect();

        expect(element.getAttribute("aria-selected")).to.equal("true");

        element.selected = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-selected")).to.equal("false");

        await disconnect();
    });

    it("should NOT set the `aria-selected` attribute if `selected` value is not provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        await connect();

        expect(element.hasAttribute("aria-selected")).to.equal(false);

        await disconnect();
    });

    it("should add a class of `selected` when selected is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.selected = true;

        await connect();

        expect(element.classList.contains("selected")).to.equal(true);

        await disconnect();
    });

    it("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should NOT set the `aria-disabled` attribute if `disabled` value is not provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        await connect();

        expect(element.hasAttribute("aria-disabled")).to.equal(false);

        await disconnect();
    });

    it("should add a class of `disabled` when disabled is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.disabled = true;

        await connect();

        expect(element.classList.contains("disabled")).to.equal(true);

        await disconnect();
    });

    it("should add a slot attribute of `item` to nested tree items", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(nestedItem);

        await connect();

        expect(nestedItem.getAttribute("slot")).to.equal("item");

        await disconnect();
    });

    it("should add a class of `nested` when nested is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.nested = true;

        await connect();

        expect(element.classList.contains("nested")).to.equal(true);

        await disconnect();
    });

    it("should NOT set a tabindex when disabled is `true`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.disabled = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(false);
        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    it("should set a tabindex when `focusable` is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );

        element.focusable = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(true);
        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should render an element with a class of `expand-collapse-button` when nested tree items exist", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(nestedItem);

        await connect();
        await DOM.nextUpdate();
        expect(element.shadowRoot?.querySelector(".expand-collapse-button")).to.exist;

        await disconnect();
    });

    it("should include an aria-hidden attribute on the `expand-collapse-button`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(nestedItem);

        await connect();
        await DOM.nextUpdate();

        let button = element.shadowRoot?.querySelector(".expand-collapse-button");

        expect(button?.getAttribute("aria-hidden")).to.equal("true");

        await disconnect();
    });

    it("should render an element with a role of `group` when nested tree items exist and expanded is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(nestedItem);
        element.expanded = true;

        await connect();
        await DOM.nextUpdate();

        expect(
            element.shadowRoot?.querySelector(".items")?.getAttribute("role")
        ).to.equal("group");

        await disconnect();
    });

    it("should NOT render an element with a role of `group` when nested tree items exist and expanded is false", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeItem>(
            "fast-tree-item"
        );
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(nestedItem);

        await connect();
        await DOM.nextUpdate();

        expect(element.shadowRoot?.querySelector(".items")).not.to.exist;

        await disconnect();
    });

    describe("events", () => {
        it("should fire a change event when expanded changes", async () => {
            const { element, connect, disconnect } = await fixture<FASTTreeItem>(
                "fast-tree-item"
            );
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);

            let wasClicked = false;

            element.addEventListener("expanded-change", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await connect();
            await DOM.nextUpdate();

            let button = element.shadowRoot?.querySelector(
                ".expand-collapse-button"
            ) as any;
            button?.click();

            await DOM.nextUpdate();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should toggle the expanded state when `expand-collapse-button` is clicked", async () => {
            const { element, connect, disconnect } = await fixture<FASTTreeItem>(
                "fast-tree-item"
            );
            const nestedItem = document.createElement("fast-tree-item");

            element.appendChild(nestedItem);

            await connect();
            await DOM.nextUpdate();

            let button = element.shadowRoot?.querySelector(
                ".expand-collapse-button"
            ) as any;
            button?.click();

            await DOM.nextUpdate();

            expect(element.expanded).to.equal(true);
            expect(element.getAttribute("aria-expanded")).to.equal("true");

            button?.click();

            await DOM.nextUpdate();

            expect(element.expanded).to.equal(false);
            expect(element.getAttribute("aria-expanded")).to.equal(null);

            await disconnect();
        });

        it("should fire a selected change event when selected changes", async () => {
            const { element, connect, disconnect } = await fixture<FASTTreeItem>(
                "fast-tree-item"
            );
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(nestedItem);

            let wasClicked = false;

            element.addEventListener("selected-change", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await connect();
            await DOM.nextUpdate();

            let container = element.shadowRoot?.querySelector(
                ".positioning-region"
            ) as any;
            container?.click();

            await DOM.nextUpdate();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should toggle the selected state when the positioning region is clicked", async () => {
            const { element, connect, disconnect } = await fixture<FASTTreeItem>(
                "fast-tree-item"
            );
            const nestedItem = document.createElement("fast-tree-item");

            element.appendChild(nestedItem);

            await connect();
            await DOM.nextUpdate();

            let container = element.shadowRoot?.querySelector(
                ".positioning-region"
            ) as any;
            container?.click();

            await DOM.nextUpdate();

            expect(element.selected).to.equal(true);
            expect(element.getAttribute("aria-selected")).to.equal("true");

            container?.click();

            await DOM.nextUpdate();

            expect(element.selected).to.equal(false);
            expect(element.getAttribute("aria-selected")).to.equal("false");

            await disconnect();
        });

        it("should NOT toggle the selected state when the positioning region is clicked and the element is disabled", async () => {
            const { element, connect, disconnect } = await fixture<FASTTreeItem>(
                "fast-tree-item"
            );
            const nestedItem = document.createElement("fast-tree-item");

            element.appendChild(nestedItem);
            element.disabled = true;

            await connect();
            await DOM.nextUpdate();

            let container = element.shadowRoot?.querySelector(
                ".positioning-region"
            ) as any;
            container?.click();

            await DOM.nextUpdate();

            expect(element.selected).to.not.equal(true);
            expect(element.getAttribute("aria-selected")).to.equal(null);

            await disconnect();
        });
    });
});
