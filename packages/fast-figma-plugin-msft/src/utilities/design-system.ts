import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { getPluginData } from "../plugin-data";
import {
    canHaveFill,
    canHaveStroke,
    canHaveTextFill,
    isSceneNode,
} from "../utilities/node";
import { getFillRecipeNames, getFillValue } from "../color-recipies";

/**
 * Determine the contextual design system merging all upstream design systems
 */
export async function getDesignSystem(node: SceneNode): Promise<DesignSystem> {
    let parent = node.parent;
    const fills: string[] = [];
    const validFills: string[] = await getFillRecipeNames();

    while (parent !== null && isSceneNode(parent)) {
        const fillRecipe = getPluginData(parent, "fill");

        if (fillRecipe.length && canHaveFill(node) && validFills.includes(fillRecipe)) {
            fills.push(fillRecipe);
        }

        parent = parent.parent;
    }

    const reversedFills = fills.reverse();
    let backgroundColor: string = DesignSystemDefaults.backgroundColor; // TODO this should come from somewhere configurable

    for (const name of reversedFills) {
        backgroundColor = await getFillValue(name, {
            ...DesignSystemDefaults,
            backgroundColor,
        });
    }

    return {
        ...DesignSystemDefaults,
        backgroundColor,
    } as DesignSystem;
}
