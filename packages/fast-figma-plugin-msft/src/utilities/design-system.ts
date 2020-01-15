import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { getPluginData, supports } from "../plugin-data";
import { isSceneNode } from "../utilities/node";
import { getRecipeNames, getRecipeValue } from "../color-recipies";

/**
 * Determine the contextual design system merging all upstream design systems
 */
export async function getDesignSystem(node: BaseNode): Promise<DesignSystem> {
    let parent = node.parent;
    const fills: string[] = [];
    const validFills: string[] = await getRecipeNames("backgroundFill");

    while (parent !== null && isSceneNode(parent)) {
        if (supports(parent, "backgroundFill")) {
            const fillRecipe = getPluginData(parent, "backgroundFill");

            if (validFills.includes(fillRecipe)) {
                fills.push(fillRecipe);
            }
        }

        parent = parent.parent;
    }

    const reversedFills = fills.reverse();
    // TODO: https://github.com/microsoft/fast-dna/issues/2589
    let backgroundColor: string = DesignSystemDefaults.backgroundColor;

    for (const name of reversedFills) {
        backgroundColor = await getRecipeValue("backgroundFill", name, {
            ...DesignSystemDefaults,
            backgroundColor,
        });
    }

    return {
        ...DesignSystemDefaults,
        backgroundColor,
    } as DesignSystem;
}
