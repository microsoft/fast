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
                x => x.appliedRecipes(RecipeTypes.backgroundFills).length,
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
                x => x.appliedRecipes(RecipeTypes.foregroundFills).length,
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
                x => x.appliedRecipes(RecipeTypes.strokeFills).length,
                html`
               <p class="title">Border</p>    
               ${repeat(
                   x => x.strokeRecipes,
                   html`
                   <p><td-swatch circular $value="${x =>
                       x.value}" orientation="horizontal" type="border">${x =>
                       x.value.replace("#", "")}</td-swatch></p>
               `
               )}
            `
            )}
        </div>
        <div>
            ${repeat(
                x => x.recipeOptionsByType(RecipeTypes.backgroundFills),
                html`
                Hello world
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
        console.log(this.selectedNodes);
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

    private appliedRecipes(type: RecipeTypes) {
        return this.activeRecipes.filter(recipe => recipe.type === type);
    }

    private recipeOptionsByType(type: RecipeTypes) {
        return this.recipeOptions.find(x => x.type === type) || [];
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

    private supports(type: RecipeTypes): boolean {
        return this.selectedNodes.some(node => node.supports.includes(type));
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
