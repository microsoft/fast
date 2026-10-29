import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
import { repeat } from "@microsoft/fast-element/repeat.js";
import { BENCH_TREE_CONFIG, buildTree, renderTree } from "../tree.js";
import { createMutationItems, mutationItemCount } from "./state.js";

class MutationBenchElement extends FASTElement {
    items = createMutationItems();
}

const template = html<MutationBenchElement>`
    ${repeat(
        source => source.items,
        html<number>`
            <span>${item => item}</span>
        `,
    )}
`;

/**
 * Creates a client-rendered list or hydrates its server-rendered counterpart.
 * @param measureHydration - Record the bench interval around registration and hydration.
 * @returns The bound items and their shadow root after verifying SSR node reuse.
 */
export async function initializeMutationBenchmark(measureHydration = false) {
    const host = document.getElementById("container")!;
    const serverRendered = document.body.dataset.rendering === "ssr";
    let element = host.querySelector<MutationBenchElement>("repeat-mutation-bench");
    const serverNodes = Array.from(element?.shadowRoot?.querySelectorAll("span") ?? []);

    if (serverRendered) {
        if (
            serverNodes.length !== mutationItemCount ||
            serverNodes.some((node, index) => node.textContent !== String(index))
        ) {
            throw new Error("Missing or incorrect server-rendered repeat items");
        }

        const { enableHydration } = await import("@microsoft/fast-element/hydration.js");
        enableHydration();
    }

    if (measureHydration) {
        performance.mark("bench-start");
    }

    await MutationBenchElement.define({ name: "repeat-mutation-bench", template });

    if (!serverRendered) {
        element = document.createElement("repeat-mutation-bench") as MutationBenchElement;
        const tree = buildTree({ ...BENCH_TREE_CONFIG, targetSize: 1 });
        host.append(renderTree(tree, () => element!));
    }

    if (serverRendered && !(await element!.$fastController.isHydrated)) {
        throw new Error("Repeat benchmark did not hydrate");
    }

    if (measureHydration) {
        performance.mark("bench-end");
    }

    const container = element!.shadowRoot!;
    if (serverRendered) {
        const hydratedNodes = container.querySelectorAll("span");
        if (
            hydratedNodes.length !== serverNodes.length ||
            serverNodes.some((node, index) => node !== hydratedNodes[index])
        ) {
            throw new Error("Hydration replaced server-rendered repeat nodes");
        }
    }

    return { items: element!.items, container };
}
