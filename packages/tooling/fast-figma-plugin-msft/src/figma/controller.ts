import { Controller, PluginUIState } from "../core/controller";
import {
    AdditionalData,
    AppliedDesignTokens,
    AppliedRecipes,
    RecipeEvaluations,
} from "../core/model";
import { DesignTokenType } from "../core/ui/design-token-registry";
import { PluginUINodeData } from "../core/ui/ui-controller";
import { FigmaPluginNode } from "./node";

/**
 * Serializable version of PluginUINodeData that works across Figma's iframe sandbox setup.
 */
export interface PluginUISerializableNodeData {
    id: string;
    type: string;
    supports: Array<DesignTokenType>;
    children: PluginUISerializableNodeData[];
    inheritedDesignTokens: string;
    componentDesignTokens?: string;
    designTokens: string;
    componentRecipes?: string;
    recipes: string;
    recipeEvaluations: string;
    additionalData: string;
}

/**
 * Converts node data from the UI to serializable format.
 * @param nodes Node data in the UI format.
 * @returns Node data in the serializable format.
 */
export function serializeUINodes(
    nodes: PluginUINodeData[]
): PluginUISerializableNodeData[] {
    const serializedNodes = nodes.map(
        (node): PluginUISerializableNodeData => {
            return {
                id: node.id,
                type: node.type,
                supports: node.supports,
                children: serializeUINodes(node.children),
                inheritedDesignTokens: (node.inheritedDesignTokens as AppliedDesignTokens).serialize(),
                componentDesignTokens: (node.componentDesignTokens as AppliedDesignTokens)?.serialize(),
                designTokens: node.designTokens.serialize(),
                componentRecipes: (node.componentRecipes as AppliedRecipes)?.serialize(),
                recipes: node.recipes.serialize(),
                recipeEvaluations: node.recipeEvaluations.serialize(),
                additionalData: node.additionalData.serialize(),
            };
        }
    );

    return serializedNodes;
}

/**
 * Converts node data from the serializable to UI format.
 * @param nodes Node data in the serializable format.
 * @returns Node data in the UI format.
 */
export function deserializeUINodes(
    nodes: PluginUISerializableNodeData[]
): PluginUINodeData[] {
    const deserializedNodes = nodes.map(
        (node): PluginUINodeData => {
            const inheritedDesignTokens = new AppliedDesignTokens();
            inheritedDesignTokens.deserialize(node.inheritedDesignTokens);
            const componentDesignTokens = new AppliedDesignTokens();
            componentDesignTokens.deserialize(node.componentDesignTokens);
            const designTokens = new AppliedDesignTokens();
            designTokens.deserialize(node.designTokens);
            const recipes = new AppliedRecipes();
            recipes.deserialize(node.recipes);
            const componentRecipes = new AppliedRecipes();
            componentRecipes.deserialize(node.componentRecipes);
            const recipeEvaluations = new RecipeEvaluations();
            recipeEvaluations.deserialize(node.recipeEvaluations);
            const additionalData = new AdditionalData();
            additionalData.deserialize(node.additionalData);

            return {
                id: node.id,
                type: node.type,
                supports: node.supports,
                children: deserializeUINodes(node.children),
                inheritedDesignTokens,
                componentDesignTokens,
                designTokens,
                componentRecipes,
                recipes,
                recipeEvaluations,
                additionalData,
            };
        }
    );

    return deserializedNodes;
}

export class FigmaController extends Controller {
    public getNode(id: string): FigmaPluginNode | null {
        const node = figma.getNodeById(id);
        if (node) {
            return new FigmaPluginNode(node);
        } else {
            return null;
        }
    }

    public setPluginUIState(state: PluginUIState): void {
        const message = {
            selectedNodes: serializeUINodes(state.selectedNodes),
        };

        figma.ui.postMessage(message);
    }
}
