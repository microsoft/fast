import { fillRecipies, strokeRecipies, textFillRecipies } from "../color-recipies";
import { autorun, computed, observable } from "mobx";
import { canHaveFill, canHaveStroke, canHaveTextFill } from "../utilities/node";

/**
 * Define the react state object for the Plugin UI
 */
export interface PluginUIState {
    /**
     * The type of node that is currently selected
     */
    activeNodeType: NodeType | null;

    /**
     * The set of fills available to the node
     */
    fills: Array<keyof typeof fillRecipies>;

    /**
     * The currently active fill if any, otherwise null
     */
    activeFill: keyof typeof fillRecipies | null;

    /**
     * The set of strokes available to the node
     */
    strokes: Array<keyof typeof strokeRecipies>;

    /**
     * The currently active stroke if any, otherwise null
     */
    activeStroke: keyof typeof strokeRecipies | null;

    /**
     * The set of text fills available to the node
     */
    textFills: Array<keyof typeof textFillRecipies>;

    /**
     * The currently active textFill if any, otherwise null
     */
    activeTextFill: keyof typeof textFillRecipies | null;
}

/**
 * mobx class to manage UI state. The value of the getState method
 * is sent to the UI layer via postMessage whenever a change is made
 */
export class PluginUIStateStore implements PluginUIState {
    @computed
    public get strokes(): Array<keyof typeof strokeRecipies> {
        return this.activeNodeType !== null && canHaveStroke(this.activeNodeType)
            ? (Object.keys(strokeRecipies) as Array<keyof typeof strokeRecipies>)
            : [];
    }

    @computed
    public get fills(): Array<keyof typeof fillRecipies> {
        return this.activeNodeType !== null && canHaveFill(this.activeNodeType)
            ? (Object.keys(fillRecipies) as Array<keyof typeof fillRecipies>)
            : [];
    }

    @computed
    get textFills(): Array<keyof typeof textFillRecipies> {
        return this.activeNodeType !== null && canHaveTextFill(this.activeNodeType)
            ? (Object.keys(textFillRecipies) as Array<keyof typeof textFillRecipies>)
            : [];
    }

    @observable
    public activeNodeType: NodeType | null = null;

    @observable
    public activeFill: (keyof typeof fillRecipies) | null = null;

    @observable
    public activeStroke: (keyof typeof strokeRecipies) | null = null;

    @observable
    public activeTextFill: (keyof typeof textFillRecipies) | null = null;

    constructor(onChange: (state: PluginUIState) => void) {
        autorun(() => {
            onChange(this.getState());
        });
    }

    private getState(): PluginUIState {
        return {
            activeFill: this.activeFill,
            activeNodeType: this.activeNodeType,
            activeStroke: this.activeStroke,
            activeTextFill: this.activeTextFill,
            fills: this.fills,
            strokes: this.strokes,
            textFills: this.textFills,
        };
    }
}
