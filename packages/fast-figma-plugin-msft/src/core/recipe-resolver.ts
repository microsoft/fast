import { RecipeTypes } from "./controller";
/**
 * Problem statement:
 *
 * Recipe retevial could eventually be asyc and users will be able to define recipes using the plugin.
 * Because of this, we need to isloate recipe retrevial and evaluation from the core controller. To do this,
 * we will define an abstract interface for the core controller to interact with, providing mechanisms to retrieve
 * names by type, and evalute names
 *
 */

/**
 * The recipe resolver type
 */
export abstract class RecipeResolver {
    public abstract async getRecipeNames(type: RecipeTypes): Promise<string[]>;
    public abstract async evalute(
        type: RecipeTypes,
        name: string,
        data: any
    ): Promise<string>;
}
