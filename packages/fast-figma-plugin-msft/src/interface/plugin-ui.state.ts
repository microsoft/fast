import {
    getFillRecipeNames,
    getStrokeRecipeNames,
    getTextFillRecipeNames,
} from "../color-recipies";
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
    fills: string[];

    /**
     * The currently active fill if any, otherwise null
     */
    activeFill: string;

    /**
     * The set of strokes available to the node
     */
    strokes: string[];

    /**
     * The currently active stroke if any, otherwise null
     */
    activeStroke: string;

    /**
     * The set of text fills available to the node
     */
    textFills: string[];

    /**
     * The currently active textFill if any, otherwise null
     */
    activeTextFill: string;
}

/**
 * mobx class to manage UI state. The value of the getState method
 * is sent to the UI layer via postMessage whenever a change is made
 *
 * TODO: Write test to ensure sets always start with "" to denote no selection
 */
export class PluginUIStateStore implements PluginUIState {
    @computed
    public get strokes(): string[] {
        return this.activeNodeType !== null && canHaveStroke(this.activeNodeType)
            ? [""].concat(getStrokeRecipeNames())
            : [];
    }

    @computed
    public get fills(): string[] {
        return this.activeNodeType !== null && canHaveFill(this.activeNodeType)
            ? [""].concat(getFillRecipeNames())
            : [];
    }

    @computed
    get textFills(): string[] {
        return this.activeNodeType !== null && canHaveTextFill(this.activeNodeType)
            ? [""].concat(getTextFillRecipeNames())
            : [];
    }

    @observable
    public activeNodeType: NodeType | null = null;

    @observable
    public activeFill: string = "";

    @observable
    public activeStroke: string = "";

    @observable
    public activeTextFill: string = "";

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
