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
import { Accordion, accordionTemplate as template } from "./index";
import { AccordionItem, accordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { AccordionExpandMode } from "./accordion";
const FASTAccordion = Accordion.compose({
    baseName: "accordion",
    template,
});
const FASTAccordionItem = AccordionItem.compose({
    baseName: "accordion-item",
    template: itemTemplate,
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, connect, disconnect } = yield fixture([
            FASTAccordion(),
            FASTAccordionItem(),
        ]);
        const item1 = document.createElement("fast-accordion-item");
        const item2 = document.createElement("fast-accordion-item");
        const item3 = document.createElement("fast-accordion-item");
        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);
        return { element, connect, disconnect, item1, item2, item3 };
    });
}
describe("Accordion", () => {
    it("should set an expand mode of `multi` when passed to the `expand-mode` attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expandmode = AccordionExpandMode.multi;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("expand-mode")).to.equal(
                AccordionExpandMode.multi
            );
            yield disconnect();
        }));
    it("should set an expand mode of `single` when passed to the `expand-mode` attribute", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            element.expandmode = AccordionExpandMode.single;
            yield connect();
            yield DOM.nextUpdate();
            expect(element.getAttribute("expand-mode")).to.equal(
                AccordionExpandMode.single
            );
            yield disconnect();
        }));
    it("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const { element, connect, disconnect } = yield setup();
            yield connect();
            yield DOM.nextUpdate();
            expect(element.expandmode).to.equal(AccordionExpandMode.multi);
            expect(element.getAttribute("expand-mode")).to.equal(
                AccordionExpandMode.multi
            );
            yield disconnect();
        }));
});
