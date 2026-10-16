import { FASTElement } from "../src/components/fast-element.js";
import { repeat } from "../src/templating/repeat.js";
import { html, type ViewTemplate } from "../src/templating/template.js";
import { when } from "../src/templating/when.js";
import { uniqueElementName } from "../src/testing/fixture.js";

export async function createNativeHydrationWorkload() {
    const recordName = uniqueElementName();
    const childName = uniqueElementName();
    const shellName = uniqueElementName();
    for (const name of [recordName, childName, shellName]) {
        class WorkloadElement extends FASTElement {}
        await WorkloadElement.define({ name, attributes: ["title"], template: html`` });
    }
    const root = document.createElement(shellName);
    const items = Array.from({ length: 1000 }, () => ({
        name: "record",
        children: [1, 2, 3].map(value => ({
            label: String(value),
            values: [value],
        })),
    }));
    const prefix: typeof items = Array.from({ length: 20 }, () => ({
        name: "prefix",
        children: [],
    }));
    const itemMarkup = (name: string, children: string) =>
        `<!--fe:r--><${recordName} title="${name}" data-fe="1"><!--fe:b--><!--fe:b-->${children}<!--fe:/b--><!--fe:/b--></${recordName}><!--fe:/r-->`;
    const children = [1, 2, 3]
        .map(
            value =>
                `<!--fe:r--><${childName} title="${value}" data-fe="1"><!--fe:b--><!--fe:r--><span><!--fe:b-->${value}<!--fe:/b--></span><!--fe:/r--><!--fe:/b--></${childName}><!--fe:/r-->`,
        )
        .join("");
    root.innerHTML =
        `<!--fe:b-->${itemMarkup("prefix", "").repeat(20)}<!--fe:/b-->` +
        `<!--fe:b-->${itemMarkup("record", children).repeat(1000)}<!--fe:/b-->`;
    const leaf = html<number>`<span>${x => x}</span>`;
    const child = html<(typeof items)[number]["children"][number]>`
        <${html.partial(childName)} title=${x => x.label}>${repeat(x => x.values, leaf)}</${html.partial(childName)}>
    `;
    const conditional = html<(typeof items)[number]>`${repeat(x => x.children, child)}`;
    const item = html<(typeof items)[number]>`
        <${html.partial(recordName)} title=${x => x.name}>${when(() => true, conditional)}</${html.partial(recordName)}>
    `;
    const template = html<{ prefix: typeof prefix; items: typeof items }>`
        ${repeat(x => x.prefix, item)}${repeat(x => x.items, item)}
    `;
    let hydratedViews = 0;
    function countHydrations<T>(candidate: ViewTemplate<T>) {
        const hydrate = candidate.hydrate;
        Object.defineProperty(candidate, "hydrate", {
            value: (...args: Parameters<typeof hydrate>) => {
                hydratedViews++;
                return hydrate.apply(candidate, args);
            },
        });
    }
    countHydrations(leaf);
    countHydrations(child);
    countHydrations(conditional);
    countHydrations(item);
    countHydrations(template);
    const original = Array.from(root.querySelectorAll("*"));
    const customElements =
        root.querySelectorAll(`${recordName}, ${childName}`).length + 1;
    const markedElements = root.querySelectorAll("[data-fe]").length;
    const view = template.hydrate(root.firstChild!, root.lastChild!);
    return {
        root,
        run() {
            view.bind({ prefix, items });
            view.unbind();
        },
        verify() {
            const nodes = root.querySelectorAll("*");
            const result = {
                customElements,
                markedElements,
                hydratedViews,
                elements: nodes.length,
                identity: original.every((node, index) => nodes[index] === node),
                remainingMarkers: root.querySelectorAll("[data-fe]").length,
            };
            if (
                result.customElements !== 4021 ||
                result.markedElements !== 4020 ||
                result.hydratedViews !== 8041 ||
                result.elements !== 7020 ||
                !result.identity ||
                result.remainingMarkers !== 0
            ) {
                throw new Error(
                    `Native hydration workload mismatch: ${JSON.stringify(result)}`,
                );
            }
            return result;
        },
    };
}
