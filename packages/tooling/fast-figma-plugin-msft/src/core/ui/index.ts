import {
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import {
    DesignTokenAdd,
    DesignTokensForm,
    Drawer,
    TokenGlyph,
    TokenGlyphType,
} from "./components";
import { DesignTokenDefinition, DesignTokenType } from "./design-token-registry";
import { PluginUINodeData, UIController, UIDesignTokenValue } from "./ui-controller";

TokenGlyph;
Drawer;
DesignTokenAdd;
DesignTokensForm;

const assignedTokensTemplate = (
    tokens: DesignTokenDefinition<any>[] | null,
    title: string | null,
    glyphType: TokenGlyphType = TokenGlyphType.backgroundSwatch
) => html<App>`
    ${when(
        x => tokens?.length,
        html<App>`
            ${when(
                x => title,
                html`
                    <p class="title inset">${x => title}</p>
                `
            )}
            ${repeat(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                x => tokens!,
                html<DesignTokenDefinition, App>`
                    <div class="applied-recipe">
                        <td-token-glyph
                            circular
                            value=${(x, c) =>
                                c.parent.controller.getDefaultDesignTokenValue(x.token)}
                            orientation="horizontal"
                            type="${x => glyphType}"
                        >
                            ${x => x.name}
                        </td-token-glyph>
                        <span>
                            ${(x, c) =>
                                c.parent.controller.getDefaultDesignTokenValue(x.token)}
                        </span>
                        <plugin-button
                            appearance="stealth"
                            aria-label="Detach"
                            @click=${(x, c) => c.parent.controller.removeRecipe(x)}
                        >
                            Detach
                        </plugin-button>
                    </div>
                `
            )}
        `
    )}
`;

const availableTokensTemplate = (
    tokenType: DesignTokenType,
    title: string | null,
    tokenLayout: "stack" | "grid" = "stack",
    glyphType: TokenGlyphType = TokenGlyphType.backgroundSwatch
) => html<App>`
    ${when(
        x => x.selectedNodes?.some(node => node.supports.includes(tokenType)),
        html<App>`
            ${when(
                x => title,
                html`
                    <p class="title inset">${x => title}</p>
                `
            )}
            <div class="swatch-${tokenLayout}">
                ${repeat(
                    x => x.controller.recipeOptionsByType(tokenType),
                    html<DesignTokenDefinition, App>`
                        <td-token-glyph
                            circular
                            value=${(x, c) =>
                                c.parent.controller.getDefaultDesignTokenValue(x.token)}
                            orientation="horizontal"
                            type="${x => glyphType}"
                            interactive
                            ?selected=${(x, c) =>
                                c.parent.controller.recipeIsAssigned(x.id).length > 0}
                            @click=${(x, c) => c.parent.controller.assignRecipe(x)}
                        >
                            ${x => x.name}
                        </td-token-glyph>
                    `
                )}
            </div>
        `
    )}
`;

const syncLabel =
    "Evaluate and apply all design tokens and recipes to the current selection.";
const revertLabel = "Remove all plugin data from the current selection.";

const footerTemplate = html<App>`
    <footer>
        <p class="selection-label">
            ${x =>
                x.selectedNodes?.map(node => `${node.type}`).join(" | ") ||
                "No selection"}
        </p>
        <div class="buttons">
            <plugin-button
                appearance="accent"
                aria-label=${syncLabel}
                style="display: ${x => (x.controller.autoRefresh ? "none" : "")};"
                @click=${x => x.controller.refreshSelectedNodes()}
            >
                Sync
            </plugin-button>
            <plugin-button
                appearance="stealth"
                aria-label=${revertLabel}
                @click=${x => x.controller.resetNodes()}
            >
                Reset
            </plugin-button>
        </div>
    </footer>
`;

const template = html<App>`
    <plugin-tabs activeid="recipes">
        <plugin-tab id="recipes">Recipes</plugin-tab>
        <plugin-tab id="tokens">Design Tokens</plugin-tab>
        <plugin-tab-panel id="recipesPanel">
            <div style="overflow-y: overlay;">
                ${when(
                    x => x.supportsColor,
                    html<App>`
                        <td-drawer name="Color">
                            <div slot="collapsed-content">
                                ${x => assignedTokensTemplate(x.layerRecipes, "Layer")}
                                ${x =>
                                    assignedTokensTemplate(
                                        x.backgroundRecipes,
                                        "Background"
                                    )}
                                ${x =>
                                    assignedTokensTemplate(
                                        x.foregroundRecipes,
                                        "Foreground"
                                    )}
                                ${x =>
                                    assignedTokensTemplate(
                                        x.strokeRecipes,
                                        "Stroke",
                                        TokenGlyphType.borderSwatch
                                    )}
                            </div>
                            <div>
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.layerFill,
                                        "Layer backgrounds"
                                    )}
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.backgroundFill,
                                        "Fills"
                                    )}
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.strokeFill,
                                        "Strokes",
                                        "stack",
                                        TokenGlyphType.borderSwatch
                                    )}
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.foregroundFill,
                                        "Foregrounds"
                                    )}
                            </div>
                        </td-drawer>
                    `
                )}
                ${when(
                    x => x.supportsStrokeWidth,
                    html<App>`
                        <td-drawer name="Stroke width">
                            <div slot="collapsed-content">
                                ${x =>
                                    assignedTokensTemplate(
                                        x.strokeWidthRecipes,
                                        null,
                                        TokenGlyphType.icon
                                    )}
                            </div>
                            <div>
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.strokeWidth,
                                        null,
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </td-drawer>
                    `
                )}
                ${when(
                    x => x.supportsCornerRadius,
                    html<App>`
                        <td-drawer name="Corner radius">
                            <div slot="collapsed-content">
                                ${x =>
                                    assignedTokensTemplate(
                                        x.cornerRadiusRecipes,
                                        null,
                                        TokenGlyphType.icon
                                    )}
                            </div>
                            <div>
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.cornerRadius,
                                        null,
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </td-drawer>
                    `
                )}
                ${when(
                    x => x.supportsText,
                    html<App>`
                        <td-drawer name="Text">
                            <div slot="collapsed-content">
                                ${x =>
                                    assignedTokensTemplate(
                                        x.textRecipes,
                                        null,
                                        TokenGlyphType.icon
                                    )}
                            </div>
                            <div>
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.fontName,
                                        "font name",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.fontSize,
                                        "font size",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${x =>
                                    availableTokensTemplate(
                                        DesignTokenType.lineHeight,
                                        "Line height",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </td-drawer>
                    `
                )}
            </div>
        </plugin-tab-panel>
        <plugin-tab-panel id="tokensPanel">
            ${when(
                x => x.supportsDesignSystem,
                html<App>`
                    <div class="tokens-panel-content">
                        <div>
                            <td-design-token-add
                                :designTokens=${x => x.availableDesignTokens}
                                @add=${(x, c) =>
                                    x.controller.assignDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                            ></td-design-token-add>
                            <plugin-divider></plugin-divider>
                        </div>
                        <div style="overflow-y: overlay;">
                            <td-design-tokens-form
                                :designTokens=${x => x.appliedDesignTokens}
                                @tokenChange=${(x, c) =>
                                    x.controller.assignDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                                @detach=${(x, c) =>
                                    x.controller.removeDesignToken(
                                        (c.event as CustomEvent).detail
                                    )}
                            ></td-design-tokens-form>
                        </div>
                    </div>
                `
            )}
            ${when(
                x => !x.supportsDesignSystem,
                html`
                    <div>Selected layers don't support design tokens</div>
                `
            )}
        </plugin-tab-panel>
    </plugin-tabs>
    ${x => footerTemplate}
`;

const styles = css`
    :host {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100%;
    }

    plugin-tabs::part(tablist) {
        border-bottom: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }

    plugin-tab-panel {
        height: calc(556px - 40px);
        overflow-y: overlay;
        padding: 0 8px;
    }

    plugin-tab-panel::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
    }

    plugin-tab-panel::-webkit-scrollbar-track {
        margin: 1px;
        background-color: transparent;
    }

    plugin-tab-panel::-webkit-scrollbar-thumb {
        border: 2px solid #fff;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0);
    }

    plugin-tab-panel:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.13);
    }

    plugin-tab-panel::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(0, 0, 0, 0.13);
    }

    .swatch-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        justify-items: stretch;
        margin-inline-end: calc(var(--design-unit) * 2px);
    }

    .swatch-grid > * {
        margin-bottom: calc(var(--design-unit) * 3px);
    }

    .swatch-stack {
        display: flex;
        flex-direction: column;
    }

    .swatch-stack > * {
        padding: calc(var(--design-unit) * 2px) 0;
        padding-inline-start: calc(var(--design-unit) * 4px);
        padding-inline-end: calc(var(--design-unit) * 1px);
    }

    .inset {
        padding: 0 calc(var(--design-unit) * 2px);
    }

    .applied-recipe {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        padding-inline-start: calc(var(--design-unit) * 2px);
        margin-bottom: 8px;
    }

    .applied-recipe > span {
        margin: 0 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: right;
    }

    .tokens-panel-content {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }

    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px calc(var(--design-unit) * 2px) 4px calc(var(--design-unit) * 4px);
    }

    footer .selection-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    footer .buttons {
        display: flex;
        gap: 8px;
    }
`;

@customElement({
    name: "td-app",
    template,
    styles,
})
export class App extends FASTElement {
    @observable
    readonly controller: UIController;

    @observable
    supportsColor: boolean;

    @observable
    supportsStrokeWidth: boolean;

    @observable
    supportsCornerRadius: boolean;

    @observable
    supportsText: boolean;

    @observable
    layerRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    backgroundRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    foregroundRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    strokeRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    strokeWidthRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    cornerRadiusRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    textRecipes: DesignTokenDefinition<any>[] | null;

    @observable
    supportsDesignSystem: boolean;

    @observable
    appliedDesignTokens: UIDesignTokenValue[] | null;

    @observable
    availableDesignTokens: DesignTokenDefinition<any>[] | null;

    @observable
    selectedNodes: PluginUINodeData[] | null;
    selectedNodesChanged(prev: PluginUINodeData[], next: PluginUINodeData[]) {
        this.controller.setSelectedNodes(next);

        this.supportsColor =
            this.selectedNodes?.some(
                node =>
                    node.supports.includes(DesignTokenType.backgroundFill) ||
                    node.supports.includes(DesignTokenType.foregroundFill) ||
                    node.supports.includes(DesignTokenType.strokeFill)
            ) || false;
        this.supportsStrokeWidth = this.controller.supports(DesignTokenType.strokeWidth);
        this.supportsCornerRadius = this.controller.supports(
            DesignTokenType.cornerRadius
        );
        this.supportsText = this.controller.supports(DesignTokenType.fontName);

        this.layerRecipes = this.controller.appliedRecipes(DesignTokenType.layerFill);
        this.backgroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.backgroundFill
        );
        this.foregroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.foregroundFill
        );
        this.strokeRecipes = this.controller.appliedRecipes(DesignTokenType.strokeFill);
        this.strokeWidthRecipes = this.controller.appliedRecipes(
            DesignTokenType.strokeWidth
        );
        this.cornerRadiusRecipes = this.controller.appliedRecipes(
            DesignTokenType.cornerRadius
        );
        this.textRecipes = [
            ...this.controller.appliedRecipes(DesignTokenType.fontName),
            ...this.controller.appliedRecipes(DesignTokenType.fontSize),
            ...this.controller.appliedRecipes(DesignTokenType.lineHeight),
        ];

        this.supportsDesignSystem = this.controller.supports(DesignTokenType.designToken);

        // Get all applied design tokens except fillColor because it's handled through a recipe or plain color from the design tool.
        this.appliedDesignTokens = this.controller.appliedDesignTokens();
        //.filter(token => token.definition.id !== "fillColor");

        // Get all design tokens that can be added, which is the full list except any already applied /* or fillColor (see above). */
        this.availableDesignTokens = this.controller.getDesignTokenDefinitions().filter(
            definition =>
                this.appliedDesignTokens!.find(
                    appliedToken => appliedToken.definition.id === definition.id
                ) || true //&& definition.id !== "fillColor"
        );
    }

    constructor() {
        super();

        this.controller = new UIController(nodes => this.dispatchState(nodes));
    }

    private dispatchState(selectedNodes: PluginUINodeData[]): void {
        this.$emit("dispatch", selectedNodes);
    }
}
