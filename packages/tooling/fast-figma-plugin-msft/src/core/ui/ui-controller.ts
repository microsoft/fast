import { SwatchRGB } from "@fluentui/web-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignToken, DesignTokenValue } from "@microsoft/fast-foundation";
import {
    AdditionalData,
    AppliedDesignToken,
    AppliedRecipe,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedRecipes,
    RecipeEvaluation,
} from "../model";
import {
    DesignTokenDefinition,
    DesignTokenRegistry,
    DesignTokenType,
} from "./design-token-registry";
import { registerRecipes, registerTokens } from "./recipes";

/**
 * Represents a Node on the UI side.
 */
export interface PluginUINodeData extends PluginNodeData {
    /**
     * The ID of the node
     */
    id: string;

    /**
     * The node type
     */
    type: string;

    /**
     * The recipe types that the node supports
     */
    supports: Array<DesignTokenType>;

    /**
     * For other transient data exchanged between the design tool and the plugin.
     */
    additionalData: AdditionalData;

    /**
     * The design token values inherited by this node from layer hierarchy.
     */
    inheritedDesignTokens: ReadonlyAppliedDesignTokens;

    /**
     * The design token values inherited by an instance node from the main component.
     */
    componentDesignTokens?: ReadonlyAppliedDesignTokens;

    /**
     * Recipes inherited by an instance node from the main component.
     */
    componentRecipes?: ReadonlyAppliedRecipes;

    /**
     * Children of this node that have design tokens or recipes applied.
     */
    children: PluginUINodeData[];
}

/**
 * Simple display information for representing design tokens applied to one or more Nodes.
 */
export interface UIDesignTokenValue {
    /**
     * The definition of the design token.
     */
    definition: DesignTokenDefinition;

    /**
     * Represents the design token value if all selected nodes have the same value.
     */
    value?: string;

    /**
     * If the selected nodes have multiple different values this will be a list for display.
     */
    multipleValues?: string;
}

/**
 * The Controller for the UI side of the plugin, which encapsulates the business logic of
 * applying design tokens and recipes and evaluating the changes for the selected nodes.
 */
export class UIController {
    private readonly _updateStateCallback: (
        selectedNodes: PluginUINodeData[]
    ) => void | undefined;

    // This is adapting the new token model to the previous plugin structure. Recipes are now just tokens,
    // but the separation is useful for now in that a token is where you set a value and a recipe you apply to some visual element.
    private readonly _designTokenRegistry: DesignTokenRegistry = new DesignTokenRegistry();
    private readonly _recipeRegistry: DesignTokenRegistry = new DesignTokenRegistry();

    /**
     * The container for the elements created for each node so we can resolve values from the Design Token infrastructure.
     * We don't need to set values for every design token because for we'll get the token's withDefault value.
     */
    private readonly _rootElement: HTMLElement;

    private _selectedNodes: PluginUINodeData[] = [];

    /**
     * Create a new UI controller.
     * @param updateStateCallback Callback function to handle updated design token and recipe application and evaluation.
     */
    constructor(updateStateCallback: (selectedNodes: PluginUINodeData[]) => void) {
        this._updateStateCallback = updateStateCallback;

        registerTokens(this._designTokenRegistry);
        registerRecipes(this._recipeRegistry);

        this._rootElement = document.createElement("div");
        this._rootElement.id = "designTokenRoot";
        document.body.appendChild(this._rootElement);
    }

    public get autoRefresh(): boolean {
        return !(
            this._selectedNodes.length === 1 && this._selectedNodes[0].type === "PAGE"
        );
    }

    /**
     * Sets the selected nodes, which sets up the UI and immediately refreshes all recipe evaluations.
     * @param nodes The selected nodes.
     */
    public setSelectedNodes(nodes: PluginUINodeData[]) {
        // console.log("--------------------------------");
        // console.log("UIController.setSelectedNodes", nodes);

        this._selectedNodes = nodes;

        this._rootElement.childNodes.forEach(child =>
            this._rootElement.removeChild(child)
        );
        nodes.forEach(node => this.setupDesignTokenElement(this._rootElement, node));

        if (this.autoRefresh) {
            this.refreshSelectedNodes("setSelectedNodes");
        }
    }

    public refreshSelectedNodes(reason: string = "refreshSelectedNodes"): void {
        this.evaluateRecipes(this._selectedNodes);

        this.dispatchState(reason);
    }

    public supports(type: DesignTokenType) {
        return this._selectedNodes.some(node => node.supports.includes(type));
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     * @returns Applied design tokens.
     */
    public appliedDesignTokens(): UIDesignTokenValue[] {
        const tokenValues = new Map<string, Set<string>>();
        const designTokens: UIDesignTokenValue[] = [];

        this._selectedNodes.forEach(node =>
            node.designTokens.forEach((designToken, designTokenId) => {
                if (designToken.value) {
                    const values = tokenValues.get(designTokenId) || new Set<string>();
                    values.add(designToken.value);
                    tokenValues.set(designTokenId, values);
                }
            })
        );

        const allDesignTokens = this._designTokenRegistry.find(
            DesignTokenType.designToken
        );

        allDesignTokens.forEach(designToken => {
            if (tokenValues.has(designToken.id)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const set = tokenValues.get(designToken.id)!;
                designTokens.push({
                    definition: designToken,
                    value: set.size === 1 ? set.values().next().value : undefined,
                    multipleValues: set.size > 1 ? [...set].join(", ") : undefined,
                });
            }
        });

        return designTokens;
    }

    /**
     * Gets a display representation of recipes applied to the selected nodes.
     * @param type Recipe type.
     * @returns Applied recipes.
     */
    public appliedRecipes(type: DesignTokenType): DesignTokenDefinition[] {
        const ids = new Set<string>();
        const recipes: DesignTokenDefinition[] = [];

        this._selectedNodes.forEach(node =>
            node.recipes.forEach((recipe, recipeId) => ids.add(recipeId))
        );

        const typeRecipes = this._recipeRegistry.find(type);

        typeRecipes.forEach(recipe => {
            if (ids.has(recipe.id)) {
                recipes.push(recipe);
            }
        });

        return recipes.filter(recipe => recipe.type === type);
    }

    /**
     * Gets a list of recipes for the recipe type.
     * @param type Recipe type.
     * @returns List of available recipes.
     */
    public recipeOptionsByType(type: DesignTokenType): DesignTokenDefinition[] {
        const val = this._recipeRegistry.find(type);
        return val;
    }

    /**
     * Returns the node IDs to which the recipe is assigned.
     * @param id - The recipe ID.
     */
    public recipeIsAssigned(id: string): string[] {
        return this._selectedNodes
            .filter(node => {
                return Object.keys(node.recipes).includes(id);
            })
            .map(node => node.id);
    }

    /**
     * Resets all design tokens and recipes for the selected nodes.
     */
    public resetNodes(): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("reset", node);

            node.designTokens.clear();
            node.recipes.clear();
            node.recipeEvaluations.clear();
        });

        this.dispatchState("resetNodes");
    }

    private evaluateRecipes(nodes: PluginUINodeData[]) {
        // console.log("  evaluateRecipes");
        nodes.forEach(node => {
            const allRecipeIds = [
                ...(node.componentRecipes
                    ? node.componentRecipes.keys()
                    : new Array<string>()),
                ...node.recipes.keys(),
            ];

            allRecipeIds.reduceRight<Array<DesignTokenDefinition>>(
                (previousRecipes, currentId, index, array) => {
                    // console.log(previousRecipes, currentId, index, array);
                    const currentRecipe = this._recipeRegistry.get(currentId);
                    if (
                        currentRecipe &&
                        !previousRecipes.find(value => value.type === currentRecipe.type)
                    ) {
                        // console.log("adding", currentRecipe);
                        this.evaluateRecipe(currentRecipe, node);
                        previousRecipes.push(currentRecipe);
                    }
                    return previousRecipes;
                },
                []
            );

            this.evaluateRecipes(node.children);
        });
    }

    private evaluateRecipe<T>(
        recipe: DesignTokenDefinition<T>,
        node: PluginUINodeData
    ): T {
        // console.log("    evaluateRecipe", recipe);
        let value: T = this.getDesignTokenValue<T>(node, recipe.token);
        if (typeof (value as any).toColorString === "function") {
            value = (value as any).toColorString();
        }
        node.recipeEvaluations.set(recipe.id, [
            new RecipeEvaluation(recipe.type, (value as unknown) as string),
        ]);
        // console.log("      evaluations", node.recipeEvaluations);

        if (recipe.type === DesignTokenType.layerFill) {
            // console.log("      Fill recipe, setting fillColor design token");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const def = this._designTokenRegistry.get("fillColor")!;
            const element = this.getElementForNode(node);
            this.setDesignTokenForElement(element, def.token, value);

            this.evaluateRecipes(node.children);
        }

        return value;
    }

    public removeRecipe(recipe: DesignTokenDefinition): void {
        this._selectedNodes.forEach(node => {
            node.recipes.delete(recipe.id);

            node.recipeEvaluations.delete(recipe.id);

            // console.log("--------------------------------");
            // console.log("removed recipe from node", recipe.id, node);
        });

        this.evaluateRecipes(this._selectedNodes);

        this.dispatchState("removeRecipe");
    }

    public assignRecipe(recipe: DesignTokenDefinition): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("assigning recipe to node", recipe);

            // There should only be able to be one recipe for a type, but maybe add safety check.
            let recipeToRemove: string | null = null;
            node.recipeEvaluations.forEach((evaluationAttrs, evaluationRecipeId) => {
                const found = evaluationAttrs.find(
                    evaluation => evaluation.type === recipe.type
                );
                if (found) {
                    recipeToRemove = evaluationRecipeId;
                }
            });

            if (recipeToRemove) {
                // console.log("  Removing recipe and evaluations for", recipeToRemove);
                node.recipes.delete(recipeToRemove);
                node.recipeEvaluations.delete(recipeToRemove);
            }

            node.recipes.set(recipe.id, new AppliedRecipe());

            this.evaluateRecipe(recipe, node);
            // console.log("  node", node);
        });

        this.dispatchState("assignRecipe");
    }

    private setDesignTokenForElement<T>(
        nodeElement: HTMLElement,
        token: DesignToken<T>,
        value: T | null
    ) {
        try {
            if (value) {
                // TODO figure out a better way to handle storage data types
                const color = parseColorHexRGB((value as unknown) as string);
                if (color) {
                    // console.log("    setting DesignToken value (color)", token.name, value);
                    token.setValueFor(
                        nodeElement,
                        (SwatchRGB.from(color) as unknown) as DesignTokenValue<T>
                    );
                } else {
                    const num = Number.parseFloat((value as unknown) as string);
                    if (!Number.isNaN(num)) {
                        // console.log("    setting DesignToken value (number)", token.name, value);
                        token.setValueFor(
                            nodeElement,
                            (num as unknown) as DesignTokenValue<T>
                        );
                    } else {
                        // console.log("    setting DesignToken value (unconverted)", token.name, value);
                        token.setValueFor(nodeElement, value as DesignTokenValue<T>);
                    }
                }
            } else {
                token.deleteValueFor(nodeElement);
            }
        } catch (e) {
            // console.warn("    token error", e);
            // Ignore, token not found
        }
    }

    private getElementForNode(node: PluginUINodeData): HTMLElement {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const element = this._rootElement.querySelector(
            `#${CSS.escape(node.id)}`
        )! as HTMLElement;
        return element;
    }

    private appliedDesignTokensHandler(
        nodeElement: HTMLElement
    ): (value: AppliedDesignToken, key: string) => void {
        return (value: AppliedDesignToken, key: string): void => {
            const def = this._designTokenRegistry.get(key);
            if (def) {
                this.setDesignTokenForElement(nodeElement, def.token, value.value);
            }
        };
    }

    private setupDesignTokenElement(element: HTMLElement, node: PluginUINodeData) {
        // console.log("  setupDesignTokenElement - node", node, "parent", element.id);

        // Create an element representing this node in our local dom.
        const nodeElement = document.createElement("div");
        nodeElement.id = node.id;
        element.appendChild(nodeElement);

        // Set all the inherited design token values for the local element.
        // console.log("    setting inherited tokens");
        node.inheritedDesignTokens.forEach(
            this.appliedDesignTokensHandler(nodeElement),
            this
        );

        // Set all design token values from the main component for the local element (an instance component).
        // console.log("    setting main component tokens", node.componentDesignTokens);
        node.componentDesignTokens?.forEach(
            this.appliedDesignTokensHandler(nodeElement),
            this
        );

        // Set all the design token override values for the local element.
        // console.log("    setting local tokens");
        node.designTokens.forEach(this.appliedDesignTokensHandler(nodeElement), this);

        // Handle any additional data. Keys are provided as design token ids.
        node.additionalData.forEach((value, key) => {
            const def = this._designTokenRegistry.get(key);
            if (def) {
                // console.log("      setting token value on element", def, "value", value);
                this.setDesignTokenForElement(nodeElement, def.token, value);
            }
        }, this);

        node.children.forEach(child => this.setupDesignTokenElement(nodeElement, child));
    }

    private valueToString(value: any): string {
        // TODO figure out a better way to handle storage data types
        if (typeof value.toColorString === "function") {
            return value.toColorString();
        } else {
            return "" + value;
        }
    }

    public getDesignTokenDefinitions(): DesignTokenDefinition<any>[] {
        return this._designTokenRegistry.find(DesignTokenType.designToken);
    }

    public getDesignTokenDefinition<T>(id: string): DesignTokenDefinition<T> | null {
        return this._designTokenRegistry.get(id);
    }

    public getDefaultDesignTokenValue<T>(token: DesignToken<T>): string {
        const val = this.valueToString(token.getValueFor(this._rootElement));
        // console.log("getDefaultDesignTokenValue", "token", token, "value", val);
        return val;
    }

    public getDesignTokenValue<T>(node: PluginUINodeData, token: DesignToken<T>): T {
        // Evaluate the token based on the tokens provided to the element.
        const element = this.getElementForNode(node);
        const val = token.getValueFor(element);
        // console.log("      getDesignTokenValue", node.id, node.type, token.name, "value", this.valueToString(val));
        return val;
    }

    private setDesignTokenForNode<T>(
        node: PluginUINodeData,
        definition: DesignTokenDefinition<T>,
        value: T | null
    ): void {
        if (value) {
            const designToken = new AppliedDesignToken();
            designToken.value = this.valueToString(value);
            node.designTokens.set(definition.id, designToken);
        } else {
            node.designTokens.delete(definition.id);
        }
        // console.log("  after set designTokens", node.id, node.type, node.designTokens);

        const element = this.getElementForNode(node);
        this.setDesignTokenForElement(element, definition.token, value);
    }

    public assignDesignToken<T>(definition: DesignTokenDefinition<T>, value: T): void {
        const nodes = this._selectedNodes.filter(node =>
            node.supports.includes(DesignTokenType.designToken)
        );

        // console.log("--------------------------------");
        // console.log("UIController.assignDesignToken", definition, value, typeof value, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, value));

        // console.log("  Evaluating all recipes for all selected nodes");
        this.evaluateRecipes(this._selectedNodes);

        this.dispatchState("assignDesignToken " + definition.id);
    }

    public removeDesignToken(definition: DesignTokenDefinition): void {
        const nodes = this._selectedNodes.filter(node =>
            node.supports.includes(DesignTokenType.designToken)
        );

        // console.log("--------------------------------");
        // console.log("UIController.removeDesignToken", definition.id, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, null));

        // console.log("  Evaluating all recipes for all selected nodes");
        this.evaluateRecipes(this._selectedNodes);

        this.dispatchState("removeDesignToken");
    }

    private dispatchState(reason: string): void {
        // console.log("UIController.dispatchState", reason);
        this._updateStateCallback(this._selectedNodes);
    }
}
