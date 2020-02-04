import { PluginNode } from "./node";
import { PluginUIPropsNodeRecipeOptions } from "./ui";

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
    // public abstract async evaluate(name: string, data: T): Promise<string>;
    public abstract async recipeDataForNode(
        node: PluginNode
    ): Promise<PluginUIPropsNodeRecipeOptions>;
}
