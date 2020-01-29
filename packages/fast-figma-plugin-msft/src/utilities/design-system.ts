import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { getPluginData, supports } from "../plugin-data";
import { isSceneNode } from "../utilities/node";

/**
 * Retrieve the design system for a node. Note that this begins aggregating
 * properties *at* the node provided, so the design-system
 */
export function getDesignSystem(node: BaseNode | null): DesignSystem;
export function getDesignSystem<T extends keyof DesignSystem>(
    node: BaseNode | null,
    ...keys: T[]
): Pick<DesignSystem, T>;
export function getDesignSystem(
    node: BaseNode | null,
    ...keys: string[]
): Partial<DesignSystem> {
    const _keys = keys.length ? keys : Object.keys(DesignSystemDefaults);
    const propertyNames: Set<string> = new Set(_keys);
    const designSystem: Partial<DesignSystem> = {};

    while (node && isSceneNode(node) && propertyNames.size) {
        if (supports(node, "designSystem")) {
            const nodeData = getPluginData(node, "designSystem");

            if (nodeData) {
                for (const key of Object.keys(nodeData)) {
                    if (propertyNames.has(key)) {
                        designSystem[key] = nodeData[key];

                        propertyNames.delete(key);
                    }
                }
            }
        }

        node = node.parent;
    }

    // Map any left over properties from the default design system
    propertyNames.forEach(
        (key: string) => (designSystem[key] = DesignSystemDefaults[key])
    );

    return designSystem;
}
