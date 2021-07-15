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
import { Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { Toolbar, toolbarTemplate as template } from "./index";
const FASTToolbar = Toolbar.compose({
    baseName: "toolbar",
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect, parent } = yield fixture(FASTToolbar());
        const control1 = document.createElement("button");
        control1.textContent = "control1";
        const control2 = document.createElement("button");
        control2.textContent = "control2";
        const control3 = document.createElement("button");
        control3.textContent = "control3";
        element.appendChild(control1);
        element.appendChild(control2);
        element.appendChild(control3);
        return { element, connect, disconnect, document, parent };
    });
}
describe("Toolbar", () => {
    it("should have a role of `toolbar`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("toolbar");
            yield disconnect();
        }));
    it("should have a default orientation of `horizontal`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("orientation")).to.equal(Orientation.horizontal);
            yield disconnect();
        }));
    it("should move focus to its first control when it receives focus", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { element, connect, disconnect, document } = yield setup();
            yield connect();
            element.focus();
            expect(
                (_a = document.activeElement) === null || _a === void 0
                    ? void 0
                    : _a.textContent
            ).to.equal("control1");
            yield disconnect();
        }));
});
