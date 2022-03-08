import React from "react";
// import DetachIcon from "./assets/detach.svg";
// import RevertIcon from "./assets/revert.svg";
import {
    CornerRadius,
    DesignTokenAddReact,
    DesignTokensFormReact,
    Drawer,
    GenericRecipe,
    Swatch as SwatchComponent,
} from "./components";
import { DesignTokenType } from "./design-token-registry";
import { PluginUINodeData, UIController } from "./ui-controller";

/* tslint:disable:no-unused-expression */
CornerRadius;
Drawer;
GenericRecipe;
SwatchComponent;
/* tslint:enable:no-unused-expression */

export interface PluginUIProps {
    selectedNodes: PluginUINodeData[];
    dispatch: (nodes: PluginUINodeData[]) => void;
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        dispatch: (): void => {
            throw new Error(
                `The UI message could not be dispatched - please provide a valid dispatch function the the PluginUI`
            );
        },
    };

    private readonly controller: UIController;

    constructor(props: PluginUIProps) {
        super(props);

        this.controller = new UIController(nodes => this.dispatchState(nodes));
    }

    public render(): JSX.Element {
        this.controller.setSelectedNodes(this.props.selectedNodes);

        return this.renderBody();
    }

    private renderFooter(): JSX.Element {
        const syncLabel =
            "Evaluate and apply all design tokens and recipes to the curren selection.";
        const revertLabel = "Remove all plugin data from the current selection.";

        return (
            <div style={{ overflow: "hidden" }}>
                <plugin-divider></plugin-divider>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding:
                            "4px calc(var(--design-unit) * 2px) 4px calc(var(--design-unit) * 4px)",
                    }}
                >
                    <p
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {this.props.selectedNodes
                            .map(node => `${node.type}`)
                            .join(" | ") || "No selection"}
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <plugin-button
                            appearance="accent"
                            aria-label={syncLabel}
                            style={{ display: this.controller.autoRefresh ? "none" : "" }}
                            onClick={this.controller.refreshSelectedNodes.bind(
                                this.controller
                            )}
                        >
                            Sync
                        </plugin-button>
                        <plugin-button
                            appearance="stealth"
                            aria-label={revertLabel}
                            onClick={this.controller.resetNodes.bind(this.controller)}
                        >
                            Reset
                        </plugin-button>
                    </div>
                </div>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        // Get all applied design tokens except fillColor because it's handled through a recipe or plain color from the design tool.
        const appliedDesignTokens = this.controller.appliedDesignTokens();
        //.filter(token => token.definition.id !== "fillColor");

        // Get all design tokens that can be added, which is the full list except any already applied or fillColor (see above).
        const availableDesignTokens = this.controller.getDesignTokenDefinitions().filter(
            definition =>
                !appliedDesignTokens.find(
                    appliedToken => appliedToken.definition.id === definition.id
                ) //&& definition.id !== "fillColor"
        );

        const layerRecipes = this.controller.appliedRecipes(DesignTokenType.layerFill);
        const backgroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.backgroundFill
        );
        const foregroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.foregroundFill
        );
        const strokeRecipes = this.controller.appliedRecipes(DesignTokenType.strokeFill);
        const strokeWidthRecipes = this.controller.appliedRecipes(
            DesignTokenType.strokeWidth
        );
        const cornerRadiusRecipes = this.controller.appliedRecipes(
            DesignTokenType.cornerRadius
        );
        const textRecipes = [
            ...this.controller.appliedRecipes(DesignTokenType.fontName),
            ...this.controller.appliedRecipes(DesignTokenType.fontSize),
            ...this.controller.appliedRecipes(DesignTokenType.lineHeight),
        ];
        const supportsDesignSystem = this.props.selectedNodes.some(node =>
            node.supports.includes(DesignTokenType.designToken)
        );

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    height: "100%",
                }}
            >
                <plugin-tabs activeid="recipes">
                    <plugin-tab id="recipes">Recipes</plugin-tab>
                    <plugin-tab id="tokens">Design Tokens</plugin-tab>
                    <plugin-tab-panel id="recipesPanel">
                        <div style={{ overflowY: "overlay" as any }}>
                            <td-drawer name="Color">
                                <div slot="collapsed-content">
                                    {layerRecipes.length ? (
                                        <>
                                            <p className="title inset">Layer</p>
                                            {layerRecipes.map(recipe => (
                                                <p
                                                    className="applied-recipe"
                                                    key={recipe.id}
                                                >
                                                    <td-swatch
                                                        circular
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        orientation="horizontal"
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>

                                                    <div>
                                                        <span>
                                                            {this.controller.getDefaultDesignTokenValue(
                                                                recipe.token
                                                            )}
                                                        </span>
                                                        <plugin-button
                                                            appearance="stealth"
                                                            aria-label="Detach"
                                                            onClick={this.controller.removeRecipe.bind(
                                                                this.controller,
                                                                recipe
                                                            )}
                                                        >
                                                            Detach
                                                        </plugin-button>
                                                    </div>
                                                </p>
                                            ))}
                                        </>
                                    ) : null}
                                    {backgroundRecipes.length ? (
                                        <>
                                            <p className="title inset">Background</p>
                                            {backgroundRecipes.map(recipe => (
                                                <p
                                                    className="applied-recipe"
                                                    key={recipe.id}
                                                >
                                                    <td-swatch
                                                        circular
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        orientation="horizontal"
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>

                                                    <div>
                                                        <span>
                                                            {this.controller.getDefaultDesignTokenValue(
                                                                recipe.token
                                                            )}
                                                        </span>
                                                        <plugin-button
                                                            appearance="stealth"
                                                            aria-label="Detach"
                                                            onClick={this.controller.removeRecipe.bind(
                                                                this.controller,
                                                                recipe
                                                            )}
                                                        >
                                                            Detach
                                                        </plugin-button>
                                                    </div>
                                                </p>
                                            ))}
                                        </>
                                    ) : null}
                                    {foregroundRecipes.length ? (
                                        <>
                                            <p className="title inset">Foreground</p>
                                            {foregroundRecipes.map(recipe => (
                                                <p
                                                    className="applied-recipe"
                                                    key={recipe.id}
                                                >
                                                    <td-swatch
                                                        circular
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        orientation="horizontal"
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>

                                                    <div>
                                                        <span>
                                                            {this.controller.getDefaultDesignTokenValue(
                                                                recipe.token
                                                            )}
                                                        </span>
                                                        <plugin-button
                                                            appearance="stealth"
                                                            aria-label="Detach"
                                                            onClick={this.controller.removeRecipe.bind(
                                                                this.controller,
                                                                recipe
                                                            )}
                                                        >
                                                            Detach
                                                        </plugin-button>
                                                    </div>
                                                </p>
                                            ))}
                                        </>
                                    ) : null}
                                    {strokeRecipes.length ? (
                                        <>
                                            <p className="title inset">Border</p>
                                            {strokeRecipes.map(recipe => (
                                                <p
                                                    className="applied-recipe"
                                                    key={recipe.id}
                                                >
                                                    <td-swatch
                                                        circular
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        orientation="horizontal"
                                                        type="border"
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>
                                                    <div>
                                                        <span>
                                                            {this.controller.getDefaultDesignTokenValue(
                                                                recipe.token
                                                            )}
                                                        </span>
                                                        <plugin-button
                                                            appearance="stealth"
                                                            aria-label="Detach"
                                                            onClick={this.controller.removeRecipe.bind(
                                                                this.controller,
                                                                recipe
                                                            )}
                                                        >
                                                            Detach
                                                        </plugin-button>
                                                    </div>
                                                </p>
                                            ))}
                                        </>
                                    ) : null}
                                </div>
                                <div>
                                    {this.props.selectedNodes.some(node =>
                                        node.supports.includes(DesignTokenType.layerFill)
                                    ) ? (
                                        <>
                                            <p className="title inset">
                                                Layer backgrounds
                                            </p>
                                            <div className="swatch-stack">
                                                {this.controller
                                                    .recipeOptionsByType(
                                                        DesignTokenType.layerFill
                                                    )
                                                    .map(recipe => {
                                                        return (
                                                            <td-swatch
                                                                key={recipe.id}
                                                                circular
                                                                value={this.controller.getDefaultDesignTokenValue(
                                                                    recipe.token
                                                                )}
                                                                orientation="horizontal"
                                                                interactive
                                                                selected={
                                                                    !!this.controller.recipeIsAssigned(
                                                                        recipe.id
                                                                    ).length
                                                                }
                                                                onClick={this.controller.assignRecipe.bind(
                                                                    this.controller,
                                                                    recipe
                                                                )}
                                                            >
                                                                {recipe.name}
                                                            </td-swatch>
                                                        );
                                                    })}
                                            </div>
                                        </>
                                    ) : null}
                                    {this.props.selectedNodes.some(node =>
                                        node.supports.includes(
                                            DesignTokenType.backgroundFill
                                        )
                                    ) ? (
                                        <>
                                            <p className="title inset">Fills</p>
                                            <div className="swatch-stack">
                                                {this.controller
                                                    .recipeOptionsByType(
                                                        DesignTokenType.backgroundFill
                                                    )
                                                    .map(recipe => {
                                                        return (
                                                            <td-swatch
                                                                key={recipe.id}
                                                                circular
                                                                value={this.controller.getDefaultDesignTokenValue(
                                                                    recipe.token
                                                                )}
                                                                orientation="horizontal"
                                                                interactive
                                                                selected={
                                                                    !!this.controller.recipeIsAssigned(
                                                                        recipe.id
                                                                    ).length
                                                                }
                                                                onClick={this.controller.assignRecipe.bind(
                                                                    this.controller,
                                                                    recipe
                                                                )}
                                                            >
                                                                {recipe.name}
                                                            </td-swatch>
                                                        );
                                                    })}
                                            </div>
                                        </>
                                    ) : null}
                                    {this.props.selectedNodes.some(node =>
                                        node.supports.includes(DesignTokenType.strokeFill)
                                    ) ? (
                                        <>
                                            <p className="title inset">Strokes</p>
                                            <div className="swatch-stack">
                                                {this.controller
                                                    .recipeOptionsByType(
                                                        DesignTokenType.strokeFill
                                                    )
                                                    .map(recipe => {
                                                        return (
                                                            <td-swatch
                                                                key={recipe.id}
                                                                circular
                                                                value={this.controller.getDefaultDesignTokenValue(
                                                                    recipe.token
                                                                )}
                                                                orientation="horizontal"
                                                                interactive
                                                                type="border"
                                                                selected={
                                                                    !!this.controller.recipeIsAssigned(
                                                                        recipe.id
                                                                    ).length
                                                                }
                                                                onClick={this.controller.assignRecipe.bind(
                                                                    this.controller,
                                                                    recipe
                                                                )}
                                                            >
                                                                {recipe.name}
                                                            </td-swatch>
                                                        );
                                                    })}
                                            </div>
                                        </>
                                    ) : null}
                                    {this.props.selectedNodes.some(node =>
                                        node.supports.includes(
                                            DesignTokenType.foregroundFill
                                        )
                                    ) ? (
                                        <>
                                            <p className="title inset">Foregrounds</p>
                                            <div className="swatch-stack">
                                                {this.controller
                                                    .recipeOptionsByType(
                                                        DesignTokenType.foregroundFill
                                                    )
                                                    .map(recipe => (
                                                        <td-swatch
                                                            key={recipe.id}
                                                            circular
                                                            value={this.controller.getDefaultDesignTokenValue(
                                                                recipe.token
                                                            )}
                                                            orientation="horizontal"
                                                            interactive
                                                            selected={
                                                                !!this.controller.recipeIsAssigned(
                                                                    recipe.id
                                                                ).length
                                                            }
                                                            onClick={this.controller.assignRecipe.bind(
                                                                this.controller,
                                                                recipe
                                                            )}
                                                        >
                                                            {recipe.name}
                                                        </td-swatch>
                                                    ))}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </td-drawer>
                            <td-drawer name="Stroke Width">
                                {this.props.selectedNodes.some(node =>
                                    node.supports.includes(DesignTokenType.strokeWidth)
                                ) ? (
                                    <div className="swatch-grid" style={{ marginTop: 8 }}>
                                        {this.controller
                                            .recipeOptionsByType(
                                                DesignTokenType.strokeWidth
                                            )
                                            .map(recipe => {
                                                return (
                                                    <td-generic-recipe
                                                        key={recipe.id}
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        interactive
                                                        selected={
                                                            !!this.controller.recipeIsAssigned(
                                                                recipe.id
                                                            ).length
                                                        }
                                                        onClick={this.controller.assignRecipe.bind(
                                                            this.controller,
                                                            recipe
                                                        )}
                                                    >
                                                        {recipe.name}
                                                    </td-generic-recipe>
                                                );
                                            })}
                                    </div>
                                ) : null}
                                {strokeWidthRecipes.length ? (
                                    <div slot="collapsed-content">
                                        {strokeWidthRecipes.map(recipe => (
                                            <p className="applied-recipe" key={recipe.id}>
                                                <td-generic-recipe
                                                    value={this.controller.getDefaultDesignTokenValue(
                                                        recipe.token
                                                    )}
                                                    orientation="horizontal"
                                                    onClick={this.controller.assignRecipe.bind(
                                                        this.controller,
                                                        recipe
                                                    )}
                                                >
                                                    {recipe.name}
                                                </td-generic-recipe>
                                                <div>
                                                    <span>
                                                        {this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                    </span>
                                                    <plugin-button
                                                        appearance="stealth"
                                                        aria-label="Detach"
                                                        onClick={this.controller.removeRecipe.bind(
                                                            this.controller,
                                                            recipe
                                                        )}
                                                    >
                                                        Detach
                                                    </plugin-button>
                                                </div>
                                            </p>
                                        ))}
                                    </div>
                                ) : null}
                            </td-drawer>
                            <td-drawer name="Corner Radius">
                                {this.props.selectedNodes.some(node =>
                                    node.supports.includes(DesignTokenType.cornerRadius)
                                ) ? (
                                    <div className="swatch-grid" style={{ marginTop: 8 }}>
                                        {this.controller
                                            .recipeOptionsByType(
                                                DesignTokenType.cornerRadius
                                            )
                                            .map(recipe => {
                                                return (
                                                    <td-corner-radius
                                                        key={recipe.id}
                                                        value={this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                        interactive
                                                        selected={
                                                            !!this.controller.recipeIsAssigned(
                                                                recipe.id
                                                            ).length
                                                        }
                                                        onClick={this.controller.assignRecipe.bind(
                                                            this.controller,
                                                            recipe
                                                        )}
                                                    >
                                                        {recipe.name}
                                                    </td-corner-radius>
                                                );
                                            })}
                                    </div>
                                ) : null}
                                {cornerRadiusRecipes.length ? (
                                    <div slot="collapsed-content">
                                        {cornerRadiusRecipes.map(recipe => (
                                            <p className="applied-recipe" key={recipe.id}>
                                                <td-corner-radius
                                                    value={this.controller.getDefaultDesignTokenValue(
                                                        recipe.token
                                                    )}
                                                    orientation="horizontal"
                                                    onClick={this.controller.assignRecipe.bind(
                                                        this.controller,
                                                        recipe
                                                    )}
                                                >
                                                    {recipe.name}
                                                </td-corner-radius>
                                                <div>
                                                    <span>
                                                        {this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                    </span>
                                                    <plugin-button
                                                        appearance="stealth"
                                                        aria-label="Detach"
                                                        onClick={this.controller.removeRecipe.bind(
                                                            this.controller,
                                                            recipe
                                                        )}
                                                    >
                                                        Detach
                                                    </plugin-button>
                                                </div>
                                            </p>
                                        ))}
                                    </div>
                                ) : null}
                            </td-drawer>
                            <td-drawer name="Text">
                                {this.props.selectedNodes.some(node =>
                                    node.supports.includes(DesignTokenType.fontName)
                                ) ? (
                                    <div className="swatch-grid" style={{ marginTop: 8 }}>
                                        {[
                                            ...this.controller.recipeOptionsByType(
                                                DesignTokenType.fontName
                                            ),
                                            ...this.controller.recipeOptionsByType(
                                                DesignTokenType.fontSize
                                            ),
                                            ...this.controller.recipeOptionsByType(
                                                DesignTokenType.lineHeight
                                            ),
                                        ].map(recipe => {
                                            return (
                                                <td-generic-recipe
                                                    key={recipe.id}
                                                    value={this.controller.getDefaultDesignTokenValue(
                                                        recipe.token
                                                    )}
                                                    interactive
                                                    selected={
                                                        !!this.controller.recipeIsAssigned(
                                                            recipe.id
                                                        ).length
                                                    }
                                                    onClick={this.controller.assignRecipe.bind(
                                                        this.controller,
                                                        recipe
                                                    )}
                                                >
                                                    {recipe.name}
                                                </td-generic-recipe>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                {textRecipes.length ? (
                                    <div slot="collapsed-content">
                                        {textRecipes.map(recipe => (
                                            <p className="applied-recipe" key={recipe.id}>
                                                <td-generic-recipe
                                                    value={this.controller.getDefaultDesignTokenValue(
                                                        recipe.token
                                                    )}
                                                    orientation="horizontal"
                                                    onClick={this.controller.assignRecipe.bind(
                                                        this.controller,
                                                        recipe
                                                    )}
                                                >
                                                    {recipe.name}
                                                </td-generic-recipe>
                                                <div>
                                                    <span>
                                                        {this.controller.getDefaultDesignTokenValue(
                                                            recipe.token
                                                        )}
                                                    </span>
                                                    <plugin-button
                                                        appearance="stealth"
                                                        aria-label="Detach"
                                                        onClick={this.controller.removeRecipe.bind(
                                                            this.controller,
                                                            recipe
                                                        )}
                                                    >
                                                        Detach
                                                    </plugin-button>
                                                </div>
                                            </p>
                                        ))}
                                    </div>
                                ) : null}
                            </td-drawer>
                        </div>
                    </plugin-tab-panel>
                    <plugin-tab-panel id="tokensPanel">
                        {supportsDesignSystem ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateRows: "auto 1fr",
                                    height: "100%",
                                }}
                            >
                                <div>
                                    <DesignTokenAddReact
                                        designTokens={availableDesignTokens}
                                        onAdd={(e: CustomEvent) => {
                                            this.controller.assignDesignToken(
                                                e.detail.definition,
                                                e.detail.value
                                            );
                                        }}
                                    ></DesignTokenAddReact>
                                    <plugin-divider></plugin-divider>
                                </div>
                                <div style={{ overflowY: "overlay" as any }}>
                                    <DesignTokensFormReact
                                        designTokens={appliedDesignTokens}
                                        onTokenChange={(e: CustomEvent) =>
                                            this.controller.assignDesignToken(
                                                e.detail.definition,
                                                e.detail.value
                                            )
                                        }
                                        onDetach={(e: CustomEvent) =>
                                            this.controller.removeDesignToken(e.detail)
                                        }
                                    ></DesignTokensFormReact>
                                </div>
                            </div>
                        ) : (
                            <div>Selected layers don't support design tokens</div>
                        )}
                    </plugin-tab-panel>
                </plugin-tabs>

                {this.renderFooter()}
            </div>
        );
    }

    private dispatchState(selectedNodes: PluginUINodeData[]): void {
        this.props.dispatch(selectedNodes);
    }
}
