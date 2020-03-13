import {
    attr,
    css,
    customElement,
    FastElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import { Drawer, Swatch } from "./components";
import { UIMessage } from "../messaging";
import { PluginUIActiveNodeData, RecipeTypeOptions } from "./index";
import { RecipeData, RecipeTypes } from "../recipe-registry";

/* tslint:disable:no-unused-expression */
Drawer;
Swatch;
/* tslint:enable:no-unused-expression */

const template = html`
    <td-drawer title="Windows 10X Theme">
    </td-drawer>
    <td-drawer title="Color">
        <div slot="collapsed-content">
        ${when(
            x => x.backgroundRecipes.length,
            html`
            <p class="title">Background</p>    
            ${repeat(
                x => x.backgroundRecipes,
                html`
                <p><td-swatch circular $value="${x =>
                    x.value}" orientation="horizontal">${x =>
                    x.value.replace("#", "")}</td-swatch></p>
            `
            )}
        `
        )}
        ${when(
            x => x.foregroundRecipes.length,
            html`
           <p class="title">Foreground</p>    
           ${repeat(
               x => x.foregroundRecipes,
               html`
               <p><td-swatch circular $value="${x =>
                   x.value}" orientation="horizontal">${x =>
                   x.value.replace("#", "")}</td-swatch></p>
           `
           )}
        `
        )}
        ${when(
            x => x.strokeRecipes.length,
            html`
           <p class="title">Border</p>    
           ${repeat(
               x => x.strokeRecipes,
               html`
               <p><td-swatch circular $value="${x =>
                   x.value}" orientation="horizontal">${x =>
                   x.value.replace("#", "")}</td-swatch></p>
           `
           )}
        `
        )}
        </div>
    </td-drawer>
    <td-drawer title="Corner Radius">
    </td-drawer>
`;
const styles = css``;

@customElement({
    name: "theme-designer",
    template,
    styles,
})
export class ThemeDesigner extends FastElement {
    private constructed = false;
    @observable
    public selectedNodes: PluginUIActiveNodeData[] = [];
    private selectedNodesChanged(): void {
        if (this.constructed) {
            this.activeRecipes = this.setActiveRecipes();
        }
    }

    @observable
    public recipeOptions: RecipeTypeOptions[] = [];
    private recipeOptionsChanged(): void {
        if (this.constructed) {
            this.activeRecipes = this.setActiveRecipes();
        }
    }

    @observable
    private activeRecipes: RecipeData[] = [];
    private get backgroundRecipes() {
        return this.activeRecipes.filter(
            recipe => recipe.type === RecipeTypes.backgroundFills
        );
    }
    private get foregroundRecipes() {
        return this.activeRecipes.filter(
            recipe => recipe.type === RecipeTypes.foregroundFills
        );
    }
    private get strokeRecipes() {
        return this.activeRecipes.filter(
            recipe => recipe.type === RecipeTypes.strokeFills
        );
    }

    private setActiveRecipes(): RecipeData[] {
        const set = new Set();
        const recipes: RecipeData[] = [];

        this.selectedNodes.forEach(node =>
            node.recipes.forEach(recipe => set.add(recipe))
        );

        this.recipeOptions.forEach(optionSet => {
            optionSet.options.forEach(option => {
                if (set.has(option.id)) {
                    recipes.push(option);
                }
            });
        });

        return recipes;
    }

    /**
     * Dispatches a UI message. This function should be supplied by the composing application
     */
    public dispatchMessage(message: UIMessage): void {
        throw new Error(
            "A valid dispatchMessage method must be assigned to this element"
        );
    }

    constructor() {
        super();

        this.constructed = true;
    }
}
