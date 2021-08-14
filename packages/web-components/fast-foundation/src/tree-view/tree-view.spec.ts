import { expect } from "chai";
import { TreeView, treeViewTemplate as template } from "./index";
import { TreeItem, treeItemTemplate as itemTemplate } from "../tree-item";
import { fixture } from "../test-utilities/fixture";
import { DOM, customElement } from "@microsoft/fast-element";

const FASTTreeView = TreeView.compose({
    baseName: "tree-view",
    template
})

const FASTTreeItem = TreeItem.compose({
    baseName: "tree-item",
    template: itemTemplate
})

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTTreeView(), FASTTreeItem()]);

    return { element, connect, disconnect };
}

// TODO: Need to add tests for keyboard handling & focus management
describe("TreeView", () => {
    it("should include a role of `tree`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("tree");

        await disconnect();
    });

    it("should set tree item `nested` properties to true if *any* tree item has nested items", async () => {
        const { element, connect, disconnect } = await setup();
        const item1 = document.createElement("fast-tree-item");
        const item2 = document.createElement("fast-tree-item");
        const item3 = document.createElement("fast-tree-item");
        const nestedItem = document.createElement("fast-tree-item");

        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);

        item1.appendChild(nestedItem);

        await connect();
        await DOM.nextUpdate();

        expect(item1.classList.contains("nested")).to.equal(true);
        expect(item2.classList.contains("nested")).to.equal(true);
        expect(item3.classList.contains("nested")).to.equal(true);

        await disconnect();
    });
});
