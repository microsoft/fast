/**
 * Deterministic random DOM tree generator for benchmarking.
 *
 * Produces reproducible tree structures using a seeded LCG PRNG,
 * following the approach used by `@tensile-perf/tree`. The tree
 * defines the nesting hierarchy; a caller-provided `itemRenderer`
 * creates the actual DOM elements at each node.
 */

// ---------------------------------------------------------------------------
// Seeded PRNG — Linear Congruential Generator
// ---------------------------------------------------------------------------

/** Default seed matching tensile-perf's convention. */
const DEFAULT_SEED = 4212021;

/**
 * A minimal Linear Congruential Generator (LCG) for deterministic random
 * number generation. Uses the Numerical Recipes constants.
 */
class LCG {
    private state: number;

    constructor(seed: number = DEFAULT_SEED) {
        this.state = seed >>> 0;
    }

    /** Returns a pseudo-random integer in [0, 2^32). */
    next(): number {
        // Numerical Recipes LCG constants
        this.state = (1664525 * this.state + 1013904223) >>> 0;
        return this.state;
    }

    /** Returns a pseudo-random integer in [min, max). */
    range(min: number, max: number): number {
        return min + (this.next() % (max - min));
    }
}

// ---------------------------------------------------------------------------
// Tree data structures
// ---------------------------------------------------------------------------

/** A node in the generated random tree. */
export interface TreeNode {
    /** Depth of this node (0 = root). */
    depth: number;
    /** Index among siblings. */
    index: number;
    /** Child nodes. */
    children: TreeNode[];
}

/** Configuration for tree generation. */
export interface TreeConfig {
    /** Minimum branching factor at each level. */
    minBreadth: number;
    /** Maximum branching factor at each level. */
    maxBreadth: number;
    /** Minimum tree depth. */
    minDepth: number;
    /** Maximum tree depth. */
    maxDepth: number;
    /** Target total number of nodes. */
    targetSize: number;
    /** PRNG seed for reproducibility. */
    seed: number;
}

/** Named size presets matching tensile-perf's conventions. */
export const SIZE_PRESETS: Record<string, TreeConfig> = {
    xs: {
        minBreadth: 1,
        maxBreadth: 5,
        minDepth: 1,
        maxDepth: 5,
        targetSize: 250,
        seed: DEFAULT_SEED,
    },
    s: {
        minBreadth: 2,
        maxBreadth: 10,
        minDepth: 2,
        maxDepth: 10,
        targetSize: 500,
        seed: DEFAULT_SEED,
    },
    m: {
        minBreadth: 4,
        maxBreadth: 20,
        minDepth: 4,
        maxDepth: 20,
        targetSize: 1000,
        seed: DEFAULT_SEED,
    },
    l: {
        minBreadth: 8,
        maxBreadth: 40,
        minDepth: 8,
        maxDepth: 40,
        targetSize: 2000,
        seed: DEFAULT_SEED,
    },
    xl: {
        minBreadth: 16,
        maxBreadth: 80,
        minDepth: 16,
        maxDepth: 80,
        targetSize: 4000,
        seed: DEFAULT_SEED,
    },
};

// ---------------------------------------------------------------------------
// Tree builder
// ---------------------------------------------------------------------------

/**
 * Build a deterministic random tree.
 *
 * Recursively creates children with random breadth/depth within the configured
 * bounds. Loops on the root until `targetSize` is reached, matching
 * tensile-perf's `RandomTreeBuilder` behavior.
 */
export function buildTree(config: TreeConfig): TreeNode {
    const rng = new LCG(config.seed);
    let nodeCount = 0;

    function createNode(depth: number, index: number): TreeNode {
        nodeCount++;
        return { depth, index, children: [] };
    }

    function buildSubtree(parent: TreeNode, currentDepth: number): void {
        if (nodeCount >= config.targetSize) {
            return;
        }

        const maxDepthRemaining = Math.max(
            config.maxDepth - currentDepth,
            config.minDepth
        );
        const depth = rng.range(config.minDepth, maxDepthRemaining + 1);
        const breadth = rng.range(config.minBreadth, config.maxBreadth + 1);

        for (let i = 0; i < breadth && nodeCount < config.targetSize; i++) {
            const child = createNode(currentDepth + 1, i);
            parent.children.push(child);

            if (currentDepth < depth) {
                buildSubtree(child, currentDepth + 1);
            }
        }
    }

    const root = createNode(0, 0);

    // Keep building until we reach the target size, matching tensile's approach.
    while (nodeCount < config.targetSize) {
        buildSubtree(root, 0);
    }

    return root;
}

// ---------------------------------------------------------------------------
// DOM renderer
// ---------------------------------------------------------------------------

/**
 * Render a `TreeNode` hierarchy into live DOM.
 *
 * Walks the tree and calls `itemRenderer` at each node to create an element.
 * Each node is wrapped in a `<div class="tree-node depth-N index-N">` so
 * that the tree's nesting structure is expressed via wrapper divs — the
 * element returned by `itemRenderer` is a child of the wrapper, not the
 * structural host. This mirrors tensile-perf's `generateDefaultNode` pattern
 * where the fixture tree provides realistic DOM depth/breadth around the
 * component being benchmarked.
 *
 * @param node - The tree node to render.
 * @param itemRenderer - Called once per node; returns the element to mount.
 */
export function renderTree(node: TreeNode, itemRenderer: () => HTMLElement): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("tree-node", `depth-${node.depth}`, `index-${node.index}`);

    wrapper.appendChild(itemRenderer());

    for (const child of node.children) {
        wrapper.appendChild(renderTree(child, itemRenderer));
    }

    return wrapper;
}

/**
 * Count the total number of nodes in a tree.
 */
export function countNodes(node: TreeNode): number {
    let count = 1;
    for (const child of node.children) {
        count += countNodes(child);
    }
    return count;
}

/**
 * Compute the maximum depth of a tree.
 */
export function treeDepth(node: TreeNode): number {
    if (node.children.length === 0) {
        return 0;
    }
    let max = 0;
    for (const child of node.children) {
        const d = treeDepth(child);
        if (d > max) {
            max = d;
        }
    }
    return 1 + max;
}
