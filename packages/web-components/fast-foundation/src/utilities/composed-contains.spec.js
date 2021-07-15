var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
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
import { composedContains } from "./composed-contains";
import { expect } from "chai";
import {
    html,
    customElement,
    ref,
    FASTElement,
    observable,
    DOM,
} from "@microsoft/fast-element";
let TestElement = class TestElement extends FASTElement {};
__decorate([observable], TestElement.prototype, "root", void 0);
TestElement = __decorate(
    [
        customElement({
            name: "composed-contains-element",
            template: html`
                <div ${ref("root")} data-foo="bar"><slot></slot></div>
            `,
        }),
    ],
    TestElement
);
describe("The composedContains function", () => {
    it("returns true if the test and reference are the same element", () => {
        // This matches the behavior of Node.contains()
        const target = document.createElement("div");
        expect(composedContains(target, target)).to.be.true;
    });
    describe("that are in the same DOM", () => {
        it("returns true if the test is a child of the reference", () => {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);
            expect(composedContains(parent, child)).to.be.true;
        });
        it("returns false if the test is not a child of the reference", () => {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);
            expect(composedContains(child, parent)).to.be.false;
        });
    });
    describe("that are not in the same DOM", () => {
        it("should return true if the element being tested is in a shadow DOM of a child element", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const parent = document.createElement("div");
                const child = document.createElement("composed-contains-element");
                parent.appendChild(child);
                document.body.appendChild(parent);
                yield DOM.nextUpdate();
                expect(composedContains(parent, child.root)).to.be.true;
            }));
        it("should return false if the element being tested is in a shadow DOM that is not attached to a child", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const parent = document.createElement("div");
                const child = document.createElement("composed-contains-element");
                document.body.appendChild(parent);
                document.body.appendChild(child);
                yield DOM.nextUpdate();
                expect(composedContains(parent, child.root)).to.be.false;
            }));
    });
});
