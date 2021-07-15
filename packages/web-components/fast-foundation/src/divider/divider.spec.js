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
import { DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { DividerRole } from "./divider.options";
import { Divider, dividerTemplate as template } from "./index";
const FASTDivider = Divider.compose({
    baseName: "divider",
    template,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture(FASTDivider());
        return { element, connect, disconnect };
    });
}
describe("Divider", () => {
    it("should include a role attribute equal to the role provided", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.role = DividerRole.separator;
            yield connect();
            expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);
            element.role = DividerRole.presentation;
            yield DOM.nextUpdate();
            expect(element.getAttribute("role")).to.equal(`${DividerRole.presentation}`);
            yield disconnect();
        }));
    it("should include a default role of `separator` if no role is passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);
            yield disconnect();
        }));
});
