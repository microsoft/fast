export enum RecipeTypes {
    backgroundFills = "backgroundFills",
    foregroundFills = "foregroundFills",
    strokeFills = "strokeFills",
}

/**
 * An interface where all keys of RecipeTypes map to a type
 */
export type MappedRecipeTypes<T> = { [K in keyof typeof RecipeTypes]: T };

/**
 * Defines all data associated with a recipe
 */
export interface RecipeData<T = any> {
    name: string;
    value: T;
    type: RecipeTypes;
}
