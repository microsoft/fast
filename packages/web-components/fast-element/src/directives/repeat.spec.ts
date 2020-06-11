import { expect } from "chai";
import { repeat, RepeatDirective, RepeatBehavior } from "./repeat";
import { html } from "../template";
import { defaultExecutionContext, observable } from "../observation/observable";
import { DOM } from "../dom";
import { toHTML } from "../__test__/helpers";

describe("The repeat", () => {
    context("template function", () => {
        it("returns a RepeatDirective", () => {
            const directive = repeat(() => [], html`test`);
            expect(directive).to.be.instanceOf(RepeatDirective);
        });
    });

    context("directive", () => {
        it("creates a RepeatBehavior", () => {
            const directive = repeat(() => [], html`test`) as RepeatDirective;
            const target = document.createComment("");
            const behavior = directive.createBehavior(target);

            expect(behavior).to.be.instanceOf(RepeatBehavior);
        });
    });

    context("behavior", () => {
        const template = html<Item>`${x => x.name}`;
        const altTemplate = html<Item>`*${x => x.name}`;
        const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const zeroThroughTen = [0].concat(oneThroughTen);

        interface Item {
            name: string;
        }

        function createArray(size: number) {
            const items: { name: string }[] = [];

            for (let i = 0; i < size; ++i) {
                items.push({ name: `item${i + 1}` });
            }

            return items;
        }

        class ViewModel {
            @observable items: Item[];
            @observable template = template;

            constructor(size: number) {
                this.items = createArray(size);
            }
        }

        function createLocation() {
            const parent = document.createElement("div");
            const location = document.createComment("");

            parent.appendChild(location);

            return { parent, location };
        }

        function createOutput(
            size: number,
            filter: (index: number) => boolean = () => true,
            prefix = ""
        ) {
            let output = "";

            for (let i = 0; i < size; ++i) {
                if (filter(i)) {
                    output += `${prefix}item${i + 1}`;
                }
            }

            return output;
        }

        zeroThroughTen.forEach(size => {
            it(`renders a template for each item in array of size ${size}`, () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                expect(toHTML(parent)).to.equal(createOutput(size));
            });
        });

        zeroThroughTen.forEach(size => {
            it(`renders empty when an array of size ${size} is replaced with an empty array`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const data = new ViewModel(size);

                behavior.bind(data, defaultExecutionContext);

                expect(toHTML(parent)).to.equal(createOutput(size));

                data.items = [];

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal("");

                data.items = createArray(size);

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(createOutput(size));
            });
        });

        zeroThroughTen.forEach(size => {
            it(`updates rendered HTML when a new item is pushed into an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);
                vm.items.push({ name: "newitem" });

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(`${createOutput(size)}newitem`);
            });
        });

        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is spliced from the end of an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                const index = size - 1;
                vm.items.splice(index, 1);

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(
                    `${createOutput(size, x => x !== index)}`
                );
            });
        });

        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is spliced from the beginning of an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                vm.items.splice(0, 1);

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(`${createOutput(size, x => x !== 0)}`);
            });
        });

        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is replaced from the end of an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                const index = size - 1;
                vm.items.splice(index, 1, { name: "newitem1" }, { name: "newitem2" });

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(
                    `${createOutput(size, x => x !== index)}newitem1newitem2`
                );
            });
        });

        oneThroughTen.forEach(size => {
            it(`updates rendered HTML when a single item is replaced from the beginning of an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                vm.items.splice(0, 1, { name: "newitem1" }, { name: "newitem2" });

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(
                    `newitem1newitem2${createOutput(size, x => x !== 0)}`
                );
            });
        });

        oneThroughTen.forEach(size => {
            it(`updates all when the template changes for an array of size ${size}`, async () => {
                const { parent, location } = createLocation();
                const directive = repeat<ViewModel>(
                    x => x.items,
                    x => vm.template
                ) as RepeatDirective;
                const behavior = directive.createBehavior(location);
                const vm = new ViewModel(size);

                behavior.bind(vm, defaultExecutionContext);

                expect(toHTML(parent)).to.equal(createOutput(size));

                vm.template = altTemplate;

                await DOM.nextUpdate();

                expect(toHTML(parent)).to.equal(createOutput(size, () => true, "*"));
            });
        });
    });
});
