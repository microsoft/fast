var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { expect } from "chai";
import { TreeView, treeViewTemplate as template } from "./index";
import { TreeItem, treeItemTemplate as itemTemplate } from "../tree-item";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
const FASTTreeView = TreeView.compose({
    baseName: "tree-view",
    template,
});
const FASTTreeItem = TreeItem.compose({
    baseName: "tree-item",
    template: itemTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTTreeView(),
            FASTTreeItem(),
        ]);
        return { element, connect, disconnect };
    });
}
// TODO: Need to add tests for keyboard handling & focus management
describe("TreeView", () => {
    it("should include a role of `tree`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("tree");
            yield disconnect();
        }));
    it("should set tree item `nested` properties to true if *any* tree item has nested items", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            const item1 = document.createElement("fast-tree-item");
            const item2 = document.createElement("fast-tree-item");
            const item3 = document.createElement("fast-tree-item");
            const nestedItem = document.createElement("fast-tree-item");
            element.appendChild(item1);
            element.appendChild(item2);
            element.appendChild(item3);
            item1.appendChild(nestedItem);
            yield connect();
            yield DOM.nextUpdate();
            expect(item1.classList.contains("nested")).to.equal(true);
            expect(item2.classList.contains("nested")).to.equal(true);
            expect(item3.classList.contains("nested")).to.equal(true);
            yield disconnect();
        }));
});
