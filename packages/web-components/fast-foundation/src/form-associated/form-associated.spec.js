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
import { FormAssociated } from "./form-associated";
import { assert, expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { customElement, FASTElement, html } from "@microsoft/fast-element";
const template = html`
    <slot></slot>
`;
let TestElement = class TestElement extends FormAssociated(
    class extends FASTElement {
        constructor() {
            super();
            this.proxy = document.createElement("input");
            this.proxy.setAttribute("type", "text");
        }
    }
) {};
TestElement = __decorate(
    [
        customElement({
            name: "test-element",
            template,
        }),
    ],
    TestElement
);
let CustomInitialValue = class CustomInitialValue extends FormAssociated(
    class extends FASTElement {
        constructor() {
            super();
            this.proxy = document.createElement("input");
            this.initialValue = "foobar";
            this.proxy.setAttribute("type", "text");
        }
    }
) {};
CustomInitialValue = __decorate(
    [
        customElement({
            name: "custom-initial-value",
            template,
        }),
    ],
    CustomInitialValue
);
function setup(el = "test-element") {
    return __awaiter(this, void 0, void 0, function* () {
        const { connect, disconnect, element, parent } = yield fixture(el);
        return { connect, disconnect, element, parent };
    });
}
describe("FormAssociated:", () => {
    describe("construction and connection:", () => {
        it("should have an empty string value prior to connectedCallback", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element } = yield setup();
                expect(element.value).to.equal("");
            }));
        it("should initialize to the initial value if no value property is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                yield connect();
                expect(element.value).to.equal(element.initialValue);
                yield disconnect();
            }));
        it("should initialize to the provided value ATTRIBUTE if set pre-connection", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                element.setAttribute("value", "foobar");
                yield connect();
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("should initialize to the provided value ATTRIBUTE if set post-connection", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                yield connect();
                element.setAttribute("value", "foobar");
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("should initialize to the provided value PROPERTY if set pre-connection", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                element.value = "foobar";
                yield connect();
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("should initialize to the provided value PROPERTY if set post-connection", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                yield connect();
                element.value = "foobar";
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("should initialize to the initial value when initial value is assigned by extending class", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup(
                    "custom-initial-value"
                );
                yield connect();
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("should communicate initial value to the parent form", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup(
                    "custom-initial-value"
                );
                element.setAttribute("name", "test");
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                const formData = new FormData(form);
                expect(formData.get("test")).to.equal("foobar");
                yield disconnect();
            }));
    });
    describe("changes:", () => {
        it("setting value ATTRIBUTE should set value if value PROPERTY has not been explicitly set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                yield connect();
                element.setAttribute("value", "foobar");
                expect(element.value).to.equal("foobar");
                element.setAttribute("value", "barbat");
                expect(element.value).to.equal("barbat");
                yield disconnect();
            }));
        it("setting value ATTRIBUTE should not set value if value PROPERTY has been explicitly set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element } = yield setup();
                yield connect();
                element.value = "foobar";
                expect(element.value).to.equal("foobar");
                element.setAttribute("value", "barbat");
                expect(element.value).to.equal("foobar");
                yield disconnect();
            }));
        it("setting value ATTRIBUTE should set parent form value if value PROPERTY has not been explicitly set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                element.setAttribute("name", "test");
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                let formData = new FormData(form);
                expect(formData.get("test")).to.equal("");
                element.setAttribute("value", "foobar");
                formData = new FormData(form);
                expect(formData.get("test")).to.equal("foobar");
                yield disconnect();
            }));
        it("setting value PROPERTY should set parent form value", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                element.setAttribute("name", "test");
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                let formData = new FormData(form);
                expect(formData.get("test")).to.equal("");
                element.value = "foobar";
                formData = new FormData(form);
                expect(formData.get("test")).to.equal("foobar");
                yield disconnect();
            }));
    });
    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "test-value";
                assert(element.getAttribute("value") === null);
                assert(element.value === "test-value");
                form.reset();
                assert(element.value === "");
                yield disconnect();
            }));
        it("should reset it's value property to the value of the value attribute if it is set", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.setAttribute("value", "attr-value");
                element.value = "test-value";
                assert(element.getAttribute("value") === "attr-value");
                assert(element.value === "test-value");
                form.reset();
                assert(element.value === "attr-value");
                yield disconnect();
            }));
        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { connect, disconnect, element, parent } = yield setup();
                const form = document.createElement("form");
                form.appendChild(element);
                parent.appendChild(form);
                yield connect();
                element.value = "test-value";
                element.setAttribute("value", "attr-value");
                assert(element.value === "test-value");
                form.reset();
                assert(element.value === "attr-value");
                element.setAttribute("value", "new-attr-value");
                assert(element.value === "new-attr-value");
                yield disconnect();
            }));
    });
});
