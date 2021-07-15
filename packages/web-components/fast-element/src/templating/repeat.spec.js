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
import { expect } from "chai";
import { repeat, RepeatDirective, RepeatBehavior } from "./repeat";
import { html } from "./template";
import { defaultExecutionContext, observable } from "../observation/observable";
import { DOM } from "../dom";
import { toHTML } from "../__test__/helpers";
describe("The repeat", () => {
    context("template function", () => {
        it("returns a RepeatDirective", () => {
            const directive = repeat(
                () => [],
                html`
                    test
                `
            );
            expect(directive).to.be.instanceOf(RepeatDirective);
        });
    });
    context("directive", () => {
        it("creates a RepeatBehavior", () => {
            const directive = repeat(
                () => [],
                html`
                    test
                `
            );
            const target = document.createComment("");
            const behavior = directive.createBehavior(target);
            expect(behavior).to.be.instanceOf(RepeatBehavior);
        });
    });
    context("behavior", () => {
        const itemTemplate = html`
            ${x => x.name}
        `;
        const altItemTemplate = html`
            *${x => x.name}
        `;
        const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const zeroThroughTen = [0].concat(oneThroughTen);
        const wrappedItemTemplate = html`
            <div>${x => x.name}</div>
        `;
        function createArray(size) {
            const items = [];
            for (let i = 0; i < size; ++i) {
                items.push({ name: `item${i + 1}` });
            }
            return items;
        }
        class ViewModel {
            constructor(size, nested = false) {
                this.name = "root";
                this.template = itemTemplate;
                this.items = createArray(size);
                if (nested) {
                    this.items.forEach(x => (x.items = createArray(size)));
                }
            }
        }
        __decorate([observable], ViewModel.prototype, "items", void 0);
        __decorate([observable], ViewModel.prototype, "template", void 0);
        function createLocation() {
            const parent = document.createElement("div");
            const location = document.createComment("");
            parent.appendChild(location);
            return { parent, location };
        }
        function createOutput(
            size,
            filter = () => true,
            prefix = "",
            wrapper = input => input
        ) {
            let output = "";
            for (let i = 0; i < size; ++i) {
                if (filter(i)) {
                    output += wrapper(`${prefix}item${i + 1}`);
                }
            }
            return output;
        }
        zeroThroughTen.forEach(size => {
            it(`renders a template for each item in array of size ${size}`, () => {
                const { parent, location } = createLocation();
                const directive = repeat(x => x.items, itemTemplate);
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);
                behavior.bind(vm, defaultExecutionContext);
                expect(toHTML(parent)).to.equal(createOutput(size));
            });
        });
        zeroThroughTen.forEach(size => {
            it(`renders empty when an array of size ${size} is replaced with an empty array`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, wrappedItemTemplate);
                    const behavior = directive.createBehavior(location);
                    const data = new ViewModel(size);
                    behavior.bind(data, defaultExecutionContext);
                    expect(toHTML(parent)).to.equal(
                        createOutput(size, void 0, void 0, input => `<div>${input}</div>`)
                    );
                    data.items = [];
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal("");
                    data.items = createArray(size);
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        createOutput(size, void 0, void 0, input => `<div>${input}</div>`)
                    );
                }));
        });
        zeroThroughTen.forEach(size => {
            it(`updates rendered HTML when a new item is pushed into an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    vm.items.push({ name: "newitem" });
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(`${createOutput(size)}newitem`);
                }));
        });
        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is spliced from the end of an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    const index = size - 1;
                    vm.items.splice(index, 1);
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        `${createOutput(size, x => x !== index)}`
                    );
                }));
        });
        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is spliced from the beginning of an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    vm.items.splice(0, 1);
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        `${createOutput(size, x => x !== 0)}`
                    );
                }));
        });
        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is replaced from the end of an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    const index = size - 1;
                    vm.items.splice(index, 1, { name: "newitem1" }, { name: "newitem2" });
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        `${createOutput(size, x => x !== index)}newitem1newitem2`
                    );
                }));
        });
        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is replaced from the beginning of an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    vm.items.splice(0, 1, { name: "newitem1" }, { name: "newitem2" });
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        `newitem1newitem2${createOutput(size, x => x !== 0)}`
                    );
                }));
        });
        oneThroughTen.forEach(size => {
            it(`updates all when the template changes for an array of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(
                        x => x.items,
                        x => vm.template
                    );
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    expect(toHTML(parent)).to.equal(createOutput(size));
                    vm.template = altItemTemplate;
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(createOutput(size, () => true, "*"));
                }));
        });
        oneThroughTen.forEach(size => {
            it(`renders grandparent values from nested arrays of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const deepItemTemplate = html`
                        parent-${x => x.name}${repeat(
                            x => x.items,
                            html`
                                child-${x => x.name}root-${(x, c) =>
                                    c.parentContext.parent.name}
                            `
                        )}
                    `;
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, deepItemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size, true);
                    behavior.bind(vm, defaultExecutionContext);
                    const text = toHTML(parent);
                    for (let i = 0; i < size; ++i) {
                        const str = `child-item${i + 1}root-root`;
                        expect(text.indexOf(str)).to.not.equal(-1);
                    }
                }));
        });
        oneThroughTen.forEach(size => {
            it(`handles back to back shift operations for arrays of size ${size}`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    vm.items.shift();
                    vm.items.unshift({ name: "shift" });
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(
                        `shift${createOutput(size, index => index !== 0)}`
                    );
                }));
        });
        zeroThroughTen.forEach(size => {
            it(`updates rendered HTML when a new item is pushed into an array of size ${size} after it has been unbound and rebound`, () =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const { parent, location } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    const behavior = directive.createBehavior(location);
                    const vm = new ViewModel(size);
                    behavior.bind(vm, defaultExecutionContext);
                    yield DOM.nextUpdate();
                    behavior.unbind();
                    yield DOM.nextUpdate();
                    behavior.bind(vm, defaultExecutionContext);
                    yield DOM.nextUpdate();
                    vm.items.push({ name: "newitem" });
                    yield DOM.nextUpdate();
                    expect(toHTML(parent)).to.equal(`${createOutput(size)}newitem`);
                }));
        });
    });
});
