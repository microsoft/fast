import {
    FillRecipe,
    fillRecipies,
    StrokeRecipe,
    strokeRecipies,
    TextFillRecipe,
    textFillRecipies,
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
    fills: Array<FillRecipe & "">;

    /**
     * The currently active fill if any, otherwise null
     */
    activeFill: FillRecipe | "";

    /**
     * The set of strokes available to the node
     */
    strokes: StrokeRecipe[];

    /**
     * The currently active stroke if any, otherwise null
     */
    activeStroke: StrokeRecipe | "";

    /**
     * The set of text fills available to the node
     */
    textFills: TextFillRecipe[];

    /**
     * The currently active textFill if any, otherwise null
     */
    activeTextFill: TextFillRecipe | "";
}

/**
 * mobx class to manage UI state. The value of the getState method
 * is sent to the UI layer via postMessage whenever a change is made
 *
 * TODO: Write test to ensure sets always start with "" to denote no selection
 */
export class PluginUIStateStore implements PluginUIState {
    @computed
    public get strokes(): Array<StrokeRecipe & ""> {
        return this.activeNodeType !== null && canHaveStroke(this.activeNodeType)
            ? ([""].concat(Object.keys(strokeRecipies)) as any)
            : [];
    }

    @computed
    public get fills(): Array<FillRecipe & ""> {
        return this.activeNodeType !== null && canHaveFill(this.activeNodeType)
            ? ([""].concat(Object.keys(fillRecipies) as FillRecipe[]) as any)
            : [];
    }

    @computed
    get textFills(): Array<TextFillRecipe & ""> {
        return this.activeNodeType !== null && canHaveTextFill(this.activeNodeType)
            ? ([""].concat(Object.keys(textFillRecipies) as TextFillRecipe[]) as any)
            : [];
    }

    @observable
    public activeNodeType: NodeType | null = null;

    @observable
    public activeFill: (keyof typeof fillRecipies) | "" = "";

    @observable
    public activeStroke: (keyof typeof strokeRecipies) | "" = "";

    @observable
    public activeTextFill: (keyof typeof textFillRecipies) | "" = "";

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
