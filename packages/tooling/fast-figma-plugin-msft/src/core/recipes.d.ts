import { DesignSystemResolver } from "@microsoft/fast-components-styles-msft";
export interface RecipeStore<T = string> {
    [key: string]: {
        resolver: DesignSystemResolver<T>;
        name: string;
    };
}
export declare const fillRecipes: RecipeStore;
export declare const strokeRecipes: RecipeStore;
export declare const textFillRecipes: RecipeStore;
export declare const cornerRadiusRecipe: RecipeStore<number>;
