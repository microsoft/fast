import { expect } from "chai";
import { TreeView, TreeViewTemplate as template } from "./index";
import { TreeItem, TreeItemTemplate as itemTemplate } from "../tree-item";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";

@customElement({
    name: "fast-tree-view",
    template,
})
class FASTTreeView extends TreeView {}

@customElement({
    name: "fast-tree-item",
    template: itemTemplate,
})
class FASTTreeItem extends TreeItem {}

// TODO: Need to add tests for keyboard handling & focus management
describe("TreeView", () => {
    it("should include a role of `tree`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeView>(
            "fast-tree-view"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal("tree");

        await disconnect();
    });

    it("should set a tabindex of '0' when `focusable` is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeView>(
            "fast-tree-view"
        );

        element.focusable = true;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should set a tabindex of '-1' when `focusable` is false", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeView>(
            "fast-tree-view"
        );

        element.focusable = false;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should set a default value of 'true' to `focusable`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeView>(
            "fast-tree-view"
        );

        await connect();
        await DOM.nextUpdate();

        expect(element.focusable).to.equal(true);

        await disconnect();
    });

    it("should set tree item `nested` properties to true if *any* tree item has nested items", async () => {
        const { element, connect, disconnect } = await fixture<FASTTreeView>(
            "fast-tree-view"
        );
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
