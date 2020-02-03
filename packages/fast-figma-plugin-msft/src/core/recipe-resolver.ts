import { PluginNode } from "./node";

/**
 * Problem statement:
 *
 * Recipe revival could eventually be asyc and users will be able to define recipes using the plugin.
 * Because of this, we need to isolate recipe retrieval and evaluation from the core controller. To do this,
 * we will define an abstract interface for the core controller to interact with, providing mechanisms to retrieve
 * names by type, and evaluate names
 *
 */

/**
 * The recipe resolver type
 */
export abstract class RecipeResolver {
    public abstract async getRecipeNames(
        node: PluginNode
    ): Promise<Record<"fills" | "strokes", string[]>>;
    public abstract async evaluate(node: PluginNode, recipeName: string): Promise<string>;
}
