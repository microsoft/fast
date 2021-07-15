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
import { Breadcrumb, breadcrumbTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { BreadcrumbItem } from "../breadcrumb-item";
const FASTBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
});
const FASTBreadcrumbItem = BreadcrumbItem.compose({
    baseName: "breadcrumb-item",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTBreadcrumb(),
            FASTBreadcrumbItem(),
        ]);
        const item1 = document.createElement("fast-breadcrumb-item");
        const item2 = document.createElement("fast-breadcrumb-item");
        const item3 = document.createElement("fast-breadcrumb-item");
        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);
        return { element, connect, disconnect, item1, item2, item3 };
    });
}
describe("Breadcrumb", () => {
    it("should include a `role` of `navigation`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("navigation");
            yield disconnect();
        }));
    it("should include a `role` of `list`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelector("[role='list']")
            ).to.not.equal(null);
            yield disconnect();
        }));
    it("should not render a separator on last item", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            let items = element.querySelectorAll("fast-breadcrumb-item");
            let lastItem = items[items.length - 1];
            expect(lastItem.separator).to.equal(false);
            yield disconnect();
        }));
    it("should set the `aria-current` on the internal, last node, anchor when `href` is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect, item1, item2, item3 } = yield setup();
            const anchor1 = document.createElement("a");
            anchor1.href = "#";
            const anchor2 = document.createElement("a");
            anchor2.href = "#";
            const anchor3 = document.createElement("a");
            anchor3.href = "#";
            item1.appendChild(anchor1);
            item2.appendChild(anchor2);
            item3.appendChild(anchor3);
            yield connect();
            expect(
                element.querySelectorAll("a[href]")[2].getAttribute("aria-current")
            ).to.equal("page");
            yield disconnect();
        }));
});
