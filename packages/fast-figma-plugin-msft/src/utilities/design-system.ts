import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { DesignSystemNode, getPluginData, supports } from "../plugin-data";
import { isSceneNode } from "../utilities/node";
import { getRecipeNames, getRecipeValue } from "../color-recipies";

/**
 * Retrieve the design system for a node. Note that this begins aggregating
 * properties *at* the node provided, so the design-system
 */
export function getDesignSystem(node: BaseNode): DesignSystem;
export function getDesignSystem<T extends keyof DesignSystem>(
    node: BaseNode,
    ...keys: T[]
): Pick<DesignSystem, T>;
export function getDesignSystem(
    node: BaseNode,
    ...keys: string[]
): Partial<DesignSystem> {
    let currentNode: BaseNode | null = node;

    const _keys = keys.length ? keys : Object.keys(DesignSystemDefaults);
    const propertyNames: Set<string> = new Set(_keys);
    const designSystem: Partial<DesignSystem> = {};

    while (currentNode && isSceneNode(currentNode) && propertyNames.size) {
        if (supports(currentNode, "designSystem")) {
            const nodeData = getPluginData(currentNode, "designSystem");

            for (const key of Object.keys(nodeData)) {
                if (propertyNames.has(key)) {
                    designSystem[key] = nodeData[key];

                    propertyNames.delete(key);
                }
            }
        }

        currentNode = currentNode.parent;
    }

    // Map any left over properties from the default design system
    propertyNames.forEach(
        (key: string) => (designSystem[key] = DesignSystemDefaults[key])
    );

    return designSystem;
}
