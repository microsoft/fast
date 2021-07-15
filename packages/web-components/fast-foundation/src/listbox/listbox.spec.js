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
import { DOM } from "@microsoft/fast-element";
import { assert, expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { ListboxOption } from "../listbox-option/listbox-option";
import { listboxOptionTemplate as itemTemplate } from "../listbox-option/listbox-option.template";
import { Listbox, listboxTemplate as template } from "./index";
const FASTListbox = Listbox.compose({
    baseName: "listbox",
    template,
});
// TODO: Need to add tests for keyboard handling & focus management
describe("Listbox", () => {
    const FASTOption = ListboxOption.compose({
        baseName: "option",
        template: itemTemplate,
    });
    function setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield fixture([
                FASTListbox(),
                FASTOption(),
            ]);
            const option1 = document.createElement("fast-option");
            option1.textContent = "option 1";
            const option2 = document.createElement("fast-option");
            option2.textContent = "option 2";
            const option3 = document.createElement("fast-option");
            option3.textContent = "option 3";
            element.appendChild(option1);
            element.appendChild(option2);
            element.appendChild(option3);
            return { element, connect, disconnect, option1, option2, option3 };
        });
    }
    it("should have a role of `listbox`", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("role")).to.equal("listbox");
            yield disconnect();
        }));
    it("should have a tabindex of 0 when `disabled` is not defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            expect(element.getAttribute("tabindex")).to.equal("0");
            yield disconnect();
        }));
    it("should NOT have a tabindex when `disabled` is defined", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            element.disabled = true;
            yield DOM.nextUpdate();
            assert.isNull(element.getAttribute("tabindex"));
            yield disconnect();
        }));
    it("should select the first option when no options have the `selected` attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                option1,
                option2,
                option3,
            } = yield setup();
            yield connect();
            expect(element.selectedIndex).to.equal(0);
            expect(element.selectedOptions).to.contain(option1);
            expect(element.selectedOptions).to.not.contain(option2);
            expect(element.selectedOptions).to.not.contain(option3);
            yield disconnect();
        }));
    it("should select the option with a `selected` attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const {
                element,
                connect,
                disconnect,
                option1,
                option2,
                option3,
            } = yield setup();
            option2.setAttribute("selected", "");
            yield connect();
            expect(element.selectedIndex).to.equal(1);
            expect(element.selectedOptions).to.not.contain(option1);
            expect(element.selectedOptions).to.contain(option2);
            expect(element.selectedOptions).to.not.contain(option3);
            yield disconnect();
        }));
});
