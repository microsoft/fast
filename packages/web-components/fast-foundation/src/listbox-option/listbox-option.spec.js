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
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { ListboxOption } from "./listbox-option";
import { listboxOptionTemplate } from "../listbox-option/listbox-option.template";
const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
});
describe("ListboxOption", () => {
    function setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture(FASTOption());
            return { element, connect, disconnect };
        });
    }
    it("should set the `aria-selected` attribute equal to the `selected` value", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.selected = true;
            yield connect();
            expect(element.getAttribute("aria-selected")).to.equal("true");
            element.selected = false;
            yield DOM.nextUpdate();
            expect(element.getAttribute("aria-selected")).to.equal("false");
            yield disconnect();
        }));
});
