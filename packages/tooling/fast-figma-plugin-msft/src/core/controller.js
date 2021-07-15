import {
    createColorPalette,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { MessageAction, MessageTypes } from "./messaging";
import { RecipeRegistry, RecipeTypes } from "./recipe-registry";
/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export class Controller {
    constructor() {
        this.recipeRegistry = new RecipeRegistry();
    }
    /**
     * Retrieve the selected node ID
     */
    getSelectedNodes() {
        return this._selectedNode;
    }
    /**
     * Set the selected node ID - setting the ID will trigger
     * a UI refresh
     * @param ids the node IDs
     */
    setSelectedNodes(ids) {
        this._selectedNode = ids;
        // Queue update
        this.syncNodes(ids);
    }
    /**
     * Retrieve the UI state
     */
    getPluginUIState() {
        const selectedNodes = this.getSelectedNodes()
            .map(id => this.getNode(id))
            .filter(node => node !== null);
        const allSupported = Array.from(
            new Set(
                selectedNodes
                    .map(node => node.supports())
                    .reduce((prev, next) => prev.concat(next), [])
            )
        );
        return {
            selectedNodes: selectedNodes.map(node => ({
                id: node.id,
                type: node.type,
                supports: node.supports(),
                recipes: node.recipes,
                designSystem: Object.assign(
                    {
                        accentBaseColor:
                            node.designSystem.accentBaseColor ||
                            DesignSystemDefaults.accentBaseColor,
                    },
                    node.designSystemOverrides
                ),
            })),
            recipeOptions: selectedNodes.length
                ? allSupported
                      .filter(type => !!RecipeTypes[type])
                      .map(type => {
                          return {
                              type,
                              options: this.recipeRegistry.find(type).map(
                                  item =>
                                      this.recipeRegistry.toData(
                                          item.id,
                                          selectedNodes[0]
                                      ) // TODO: We probably shouldn't hard-code this, but what color do we display if there are multiple nodes?
                              ),
                          };
                      })
                : [],
        };
    }
    /**
     * Forces the component tree to evaluate recipes and repaint.
     * @param ids the node IDs
     */
    syncNodes(ids) {
        ids.forEach(id => this.paintTree(id));
        this.setPluginUIState(this.getPluginUIState());
    }
    handleMessage(message) {
        switch (message.type) {
            case MessageTypes.recipe:
                message.action === MessageAction.assign
                    ? this.assignRecipe(message)
                    : this.removeRecipe(message);
                break;
            case MessageTypes.designSystem:
                this.handleDesignSystemMessage(message);
                break;
            case MessageTypes.reset:
                message.nodeIds
                    .map(id => this.getNode(id))
                    .filter(node => node !== null)
                    .forEach(node => {
                        // Delete design system
                        Object.keys(node.designSystemOverrides).map(key => {
                            node.deleteDesignSystemProperty(key);
                        });
                        node.recipes = [];
                    });
                this.setPluginUIState(this.getPluginUIState());
                break;
            case MessageTypes.sync:
                this.syncNodes(message.nodeIds);
                break;
        }
    }
    handleDesignSystemMessage(message) {
        const nodes = message.nodeIds
            .map(id => this.getNode(id))
            .filter(node => node !== null);
        switch (message.action) {
            case MessageAction.assign:
                nodes.forEach(node =>
                    node.setDesignSystemProperty(message.property, message.value)
                );
                if (message.property === "accentBaseColor") {
                    const color = parseColorHexRGB(message.value);
                    if (color !== null) {
                        const palette = createColorPalette(color);
                        nodes.forEach(node =>
                            node.setDesignSystemProperty("accentPalette", palette)
                        );
                    }
                }
                break;
            case MessageAction.delete:
                nodes.forEach(node => node.deleteDesignSystemProperty(message.property));
                break;
        }
        nodes.forEach(node => this.paintTree(node.id));
        this.setPluginUIState(this.getPluginUIState());
    }
    removeRecipe(message) {
        message.nodeIds
            .map(id => this.getNode(id))
            .filter(node => node !== null)
            .forEach(node => {
                node.recipes = node.recipes.filter(
                    id => this.recipeRegistry.get(id).type !== message.recipeType
                );
            });
        this.setPluginUIState(this.getPluginUIState());
    }
    assignRecipe(message) {
        message.nodeIds.forEach(id => {
            const node = this.getNode(id);
            if (!node) {
                return;
            }
            const recipe = this.recipeRegistry.get(message.id);
            switch (message.action) {
                case MessageAction.assign:
                    node.recipes = node.recipes
                        .filter(
                            recipeId =>
                                this.recipeRegistry.get(recipeId).type !== recipe.type
                        )
                        .concat(recipe.id);
                    break;
            }
            switch (recipe.type) {
                case RecipeTypes.backgroundFills:
                    this.paintTree(node.id);
                    break;
                case RecipeTypes.foregroundFills:
                case RecipeTypes.strokeFills:
                case RecipeTypes.cornerRadius:
                    node.paint(this.recipeRegistry.toData(recipe.id, node));
                    break;
            }
        });
        this.setPluginUIState(this.getPluginUIState());
    }
    paintTree(id) {
        const node = this.getNode(id);
        if (!node) {
            return;
        }
        // Paint all recipes of the node
        node.recipes.forEach(recipeId => {
            node.paint(this.recipeRegistry.toData(recipeId, node));
        });
        node.children().forEach(child => {
            if (node) {
                this.paintTree(child.id);
            }
        });
    }
}
