import {
    ActionTrigger,
    ActionTriggerAppearance,
    Checkbox,
    Divider,
    Label,
    Radio,
} from "@microsoft/fast-components-react-msft";
import React from "react";
import {
    DesignSystem,
    DesignSystemDefaults,
    StandardLuminance,
} from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { BlockPicker } from "react-color";
import { MessageAction, MessageTypes, UIMessage } from "../messaging";
import { RecipeData, RecipeTypes } from "../recipe-registry";
import { detach, refresh, revertChanges } from "./glyphs";
import { CornerRadius, Drawer, Swatch } from "./components";

/* tslint:disable:no-unused-expression */
Drawer;
Swatch;
CornerRadius;
/* tslint:enable:no-unused-expression */

export interface PluginUIActiveNodeRecipeSupportOptions {
    label: string;
    options: RecipeData[];
}

export interface PluginUIActiveNodeData {
    /**
     * The ID of the node
     */
    id: string;

    /**
     * The node types
     */
    type: string;

    /**
     * The IDs of all recipes assigned to the item
     */
    recipes: string[];

    /**
     * The recipe types that the node supports
     */
    supports: Array<RecipeTypes | "designSystem">;

    /**
     * Any design system overrides applied to the node
     */
    designSystem: Partial<DesignSystem>;
}

export interface RecipeTypeOptions {
    type: RecipeTypes;
    options: RecipeData[];
}

export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
    recipeOptions: RecipeTypeOptions[];
    dispatch: (message: UIMessage) => void;
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        recipeOptions: [],
        dispatch: (): void => {
            throw new Error(
                `The UI message could not be dispatched - please provide a valid dispatch function the the PluginUI`
            );
        },
    };

    public render(): JSX.Element {
        return this.renderBody();
    }

    private renderFooter(): JSX.Element {
        const refreshLabel = "Sync selected - will re-evaluate all applied recipes.";
        const revertLabel = "Remove all plugin data from the current selection.";

        return (
            <div style={{ overflow: "hidden" }}>
                <Divider />
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
                    <div style={{ display: "flex" }}>
                        <ActionTrigger
                            style={{ fontSize: 11 }}
                            glyph={revertChanges}
                            appearance={ActionTriggerAppearance.stealth}
                            title={revertLabel}
                            aria-label={revertLabel}
                            onClick={this.props.dispatch.bind(this, {
                                type: MessageTypes.reset,
                                nodeIds: this.props.selectedNodes.map(node => node.id),
                            })}
                            children="Reset"
                        />
                        <ActionTrigger
                            style={{ fontSize: 11 }}
                            glyph={refresh}
                            appearance={ActionTriggerAppearance.stealth}
                            title={refreshLabel}
                            aria-label={refreshLabel}
                            onClick={this.props.dispatch.bind(this, {
                                type: MessageTypes.sync,
                                nodeIds: this.props.selectedNodes.map(node => node.id),
                            })}
                            children="Sync"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        const backgroundRecipes = this.appliedRecipes(RecipeTypes.backgroundFills);
        const foregroundRecipes = this.appliedRecipes(RecipeTypes.foregroundFills);
        const strokeRecipes = this.appliedRecipes(RecipeTypes.strokeFills);
        const cornerRadiusRecipes = this.appliedRecipes(RecipeTypes.cornerRadius);
        const supportsDesignSystem = this.props.selectedNodes.some(node =>
            node.supports.includes("designSystem")
        );

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    height: "100%",
                }}
            >
                <div style={{ overflowY: "overlay" as any }}>
                    <td-drawer name="Theme">
                        {supportsDesignSystem ? this.renderThemeSwitcher() : null}
                        {supportsDesignSystem ? this.renderColorPicker() : null}
                    </td-drawer>
                    <td-drawer name="Color">
                        <div slot="collapsed-content">
                            {backgroundRecipes.length ? (
                                <>
                                    <p className="title inset">Background</p>
                                    {backgroundRecipes.map(recipe => (
                                        <p className="applied-recipe" key={recipe.id}>
                                            <td-swatch
                                                circular
                                                value={recipe.value}
                                                orientation="horizontal"
                                            >
                                                {recipe.name}
                                            </td-swatch>

                                            <div>
                                                <span>
                                                    {recipe.value.replace("#", "")}
                                                </span>
                                                <ActionTrigger
                                                    glyph={detach}
                                                    appearance={
                                                        ActionTriggerAppearance.stealth
                                                    }
                                                    title={"Detach"}
                                                    aria-label={"Detach"}
                                                    onClick={this.removeRecipe.bind(
                                                        this,
                                                        RecipeTypes.backgroundFills
                                                    )}
                                                    jssStyleSheet={{
                                                        actionTrigger: { padding: "6px" },
                                                    }}
                                                />
                                            </div>
                                        </p>
                                    ))}
                                </>
                            ) : null}
                            {foregroundRecipes.length ? (
                                <>
                                    <p className="title inset">Foreground</p>
                                    {foregroundRecipes.map(recipe => (
                                        <p className="applied-recipe" key={recipe.id}>
                                            <td-swatch
                                                circular
                                                value={recipe.value}
                                                orientation="horizontal"
                                            >
                                                {recipe.name}
                                            </td-swatch>

                                            <div>
                                                <span>
                                                    {recipe.value.replace("#", "")}
                                                </span>
                                                <ActionTrigger
                                                    glyph={detach}
                                                    appearance={
                                                        ActionTriggerAppearance.stealth
                                                    }
                                                    title={"Detach"}
                                                    aria-label={"Detach"}
                                                    onClick={this.removeRecipe.bind(
                                                        this,
                                                        RecipeTypes.foregroundFills
                                                    )}
                                                    jssStyleSheet={{
                                                        actionTrigger: { padding: "6px" },
                                                    }}
                                                />
                                            </div>
                                        </p>
                                    ))}
                                </>
                            ) : null}
                            {strokeRecipes.length ? (
                                <>
                                    <p className="title inset">Border</p>
                                    {strokeRecipes.map(recipe => (
                                        <p className="applied-recipe" key={recipe.id}>
                                            <td-swatch
                                                circular
                                                value={recipe.value}
                                                orientation="horizontal"
                                                type="border"
                                            >
                                                {recipe.name}
                                            </td-swatch>
                                            <div>
                                                <span>
                                                    {recipe.value.replace("#", "")}
                                                </span>
                                                <ActionTrigger
                                                    glyph={detach}
                                                    appearance={
                                                        ActionTriggerAppearance.stealth
                                                    }
                                                    title={"Detach"}
                                                    aria-label={"Detach"}
                                                    onClick={this.removeRecipe.bind(
                                                        this,
                                                        RecipeTypes.strokeFills
                                                    )}
                                                    jssStyleSheet={{
                                                        actionTrigger: { padding: "6px" },
                                                    }}
                                                />
                                            </div>
                                        </p>
                                    ))}
                                </>
                            ) : null}
                        </div>
                        <div>
                            {this.props.selectedNodes.some(node =>
                                node.supports.includes(RecipeTypes.backgroundFills)
                            ) ? (
                                <>
                                    <p className="title inset">Page backgrounds</p>
                                    <div className="swatch-grid">
                                        {this.pageBackgroundIds()
                                            .map(id =>
                                                this.recipeOptionsByType(
                                                    RecipeTypes.backgroundFills
                                                ).find(item => item.id === id)
                                            )
                                            .filter(
                                                (recipe): recipe is RecipeData => !!recipe
                                            )
                                            .map(recipe => {
                                                return (
                                                    <td-swatch
                                                        key={recipe.id}
                                                        value={recipe.value}
                                                        title={recipe.value}
                                                        interactive
                                                        selected={
                                                            !!this.recipeIsAssigned(
                                                                recipe.id
                                                            ).length
                                                        }
                                                        onClick={this.setRecipe.bind(
                                                            this,
                                                            recipe.id,
                                                            recipe.type
                                                        )}
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>
                                                );
                                            })}
                                    </div>
                                    <p className="title inset">Backgrounds and borders</p>
                                    <div className="swatch-stack">
                                        {this.recipeOptionsByType(
                                            RecipeTypes.backgroundFills
                                        )
                                            .filter(
                                                recipe =>
                                                    !this.pageBackgroundIds().includes(
                                                        recipe.id
                                                    )
                                            )
                                            .map(recipe => {
                                                return (
                                                    <td-swatch
                                                        key={recipe.id}
                                                        circular
                                                        value={recipe.value}
                                                        title={recipe.value}
                                                        orientation="horizontal"
                                                        interactive
                                                        selected={
                                                            !!this.recipeIsAssigned(
                                                                recipe.id
                                                            ).length
                                                        }
                                                        onClick={this.setRecipe.bind(
                                                            this,
                                                            recipe.id,
                                                            recipe.type
                                                        )}
                                                    >
                                                        {recipe.name}
                                                    </td-swatch>
                                                );
                                            })}
                                        <Divider style={{ marginTop: 12 }} />
                                        {this.recipeOptionsByType(RecipeTypes.strokeFills)
                                            .filter(
                                                recipe =>
                                                    !this.pageBackgroundIds().includes(
                                                        recipe.id
                                                    )
                                            )
                                            .map(recipe => {
                                                return (
                                                    <td-swatch
                                                        key={recipe.id}
                                                        circular
                                                        value={recipe.value}
                                                        title={recipe.value}
                                                        orientation="horizontal"
                                                        interactive
                                                        type="border"
                                                        selected={
                                                            !!this.recipeIsAssigned(
                                                                recipe.id
                                                            ).length
                                                        }
                                                        onClick={this.setRecipe.bind(
                                                            this,
                                                            recipe.id,
                                                            recipe.type
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
                                node.supports.includes(RecipeTypes.foregroundFills)
                            ) ? (
                                <>
                                    <p className="title inset">Foregrounds</p>
                                    <div className="swatch-grid">
                                        {this.recipeOptionsByType(
                                            RecipeTypes.foregroundFills
                                        ).map(recipe => (
                                            <td-swatch
                                                key={recipe.id}
                                                circular
                                                value={recipe.value}
                                                title={recipe.value}
                                                interactive
                                                selected={
                                                    !!this.recipeIsAssigned(recipe.id)
                                                        .length
                                                }
                                                onClick={this.setRecipe.bind(
                                                    this,
                                                    recipe.id,
                                                    recipe.type
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
                    <td-drawer name="Corner Radius">
                        {this.props.selectedNodes.some(node =>
                            node.supports.includes(RecipeTypes.cornerRadius)
                        ) ? (
                            <div className="swatch-grid" style={{ marginTop: 8 }}>
                                {this.recipeOptionsByType(RecipeTypes.cornerRadius).map(
                                    recipe => {
                                        return (
                                            <td-corner-radius
                                                key={recipe.id}
                                                value={recipe.value}
                                                interactive
                                                selected={
                                                    !!this.recipeIsAssigned(recipe.id)
                                                        .length
                                                }
                                                onClick={this.setRecipe.bind(
                                                    this,
                                                    recipe.id,
                                                    recipe.type
                                                )}
                                            >
                                                {recipe.name}
                                            </td-corner-radius>
                                        );
                                    }
                                )}
                            </div>
                        ) : null}
                        {cornerRadiusRecipes.length ? (
                            <div slot="collapsed-content">
                                {cornerRadiusRecipes.map(recipe => (
                                    <p className="applied-recipe" key={recipe.id}>
                                        <td-corner-radius
                                            value={recipe.value}
                                            orientation="horizontal"
                                            onClick={this.setRecipe.bind(
                                                this,
                                                recipe.id,
                                                recipe.type
                                            )}
                                        >
                                            {recipe.name}
                                        </td-corner-radius>
                                        <div>
                                            <span>{recipe.value}</span>
                                            <ActionTrigger
                                                glyph={detach}
                                                appearance={
                                                    ActionTriggerAppearance.stealth
                                                }
                                                title={"Detach"}
                                                aria-label={"Detach"}
                                                onClick={this.removeRecipe.bind(
                                                    this,
                                                    RecipeTypes.cornerRadius
                                                )}
                                                jssStyleSheet={{
                                                    actionTrigger: { padding: "6px" },
                                                }}
                                            />
                                        </div>
                                    </p>
                                ))}
                            </div>
                        ) : null}
                    </td-drawer>
                    <button className="button">Export</button>
                </div>
                {this.renderFooter()}
            </div>
        );
    }

    private renderColorPicker(): JSX.Element {
        const type = "accentBaseColor";
        const values = this.props.selectedNodes
            .map(node => node.designSystem[type])
            .filter(value => !!value);

        const onChange = (value: any, e: React.ChangeEvent<HTMLInputElement>): void => {
            const hex: string = value.hex;
            const parsed = parseColorHexRGB(hex);

            if (parsed instanceof ColorRGBA64) {
                this.props.dispatch({
                    nodeIds: this.props.selectedNodes.map(node => node.id),
                    type: MessageTypes.designSystem,
                    action: MessageAction.assign,
                    value: hex.toUpperCase(),
                    property: type,
                });
            }
        };

        return (
            <p className="inset">
                <Label style={{ width: "100%" }}>
                    <p>Accent color</p>
                    <BlockPicker
                        color={values.length ? values[0] : DesignSystemDefaults[type]}
                        onChangeComplete={onChange}
                        colors={[
                            "#128475",
                            "#1C881E",
                            "#FDB82C",
                            "#0078D4",
                            "#8664C3",
                            "#6A2A2B",
                        ]}
                    />
                </Label>
            </p>
        );
    }

    private appliedRecipes(type: RecipeTypes) {
        const set = new Set();
        const recipes: RecipeData[] = [];

        this.props.selectedNodes.forEach(node =>
            node.recipes.forEach(recipe => set.add(recipe))
        );

        this.props.recipeOptions.forEach(optionSet => {
            optionSet.options.forEach(option => {
                if (set.has(option.id)) {
                    recipes.push(option);
                }
            });
        });

        return recipes.filter(recipe => recipe.type === type);
    }

    private recipeOptionsByType(type: RecipeTypes): RecipeData[] {
        const found = this.props.recipeOptions.find(x => x.type === type);

        const val = found ? found.options : [];
        return val;
    }

    private pageBackgroundIds() {
        return [
            "neutralLayerL1",
            "neutralLayerL1Alt",
            "neutralLayerL2",
            "neutralLayerL3",
            "neutralLayerL4",
            "neutralLayerL5",
            "neutralLayerCard",
        ];
    }

    /**
     * Returns the node ID's in which the recipe is assigned
     * @param id - the recipe ID
     */
    private recipeIsAssigned(id: string): string[] {
        return this.props.selectedNodes
            .filter(node => {
                return node.recipes.includes(id);
            })
            .map(node => node.id);
    }

    private removeRecipe = (type: RecipeTypes): void => {
        const nodeIds = this.props.selectedNodes
            .filter(node => node.supports.includes(type))
            .map(node => node.id);

        this.props.dispatch({
            type: MessageTypes.recipe,
            nodeIds,
            action: MessageAction.delete,
            recipeType: type,
        });
    };

    private setRecipe = (recipeId: string, type: RecipeTypes): void => {
        const nodeIds = this.props.selectedNodes
            .filter(node => node.supports.includes(type))
            .map(node => node.id);

        this.props.dispatch({
            id: recipeId,
            type: MessageTypes.recipe,
            nodeIds,
            action: MessageAction.assign,
        });
    };

    private renderThemeSwitcher(): JSX.Element {
        const key: keyof DesignSystem = "baseLayerLuminance";
        const nodes = this.props.selectedNodes.filter(node =>
            node.supports.includes("designSystem")
        );
        const themeData = nodes.map(node => node.designSystem.baseLayerLuminance);
        const themesApplied = themeData.filter(value => typeof value === "number");
        const nodeIds = nodes.map(node => node.id);

        const style = {
            marginInlineEnd: "12px",
        };

        const setLightTheme = this.setDesignSystemProperty.bind(
            this,
            key,
            StandardLuminance.LightMode,
            nodeIds
        );

        const setDarkTheme = this.setDesignSystemProperty.bind(
            this,
            key,
            StandardLuminance.DarkMode,
            nodeIds
        );

        const removeTheme = this.deleteDesignSystemProperty.bind(this, key, nodeIds);

        return (
            <div style={{ padding: "4px 16px 4px" }}>
                <Checkbox
                    inputId={"theme-toggle"}
                    checked={themesApplied.length > 0}
                    onChange={themesApplied.length ? removeTheme : setLightTheme}
                    style={style}
                >
                    <Label slot="label" htmlFor={"theme-toggle"}>
                        Theme
                    </Label>
                </Checkbox>
                <Radio
                    inputId={"light-theme"}
                    checked={themesApplied.includes(StandardLuminance.LightMode)}
                    disabled={themesApplied.length === 0}
                    name="theme"
                    style={style}
                    onChange={setLightTheme}
                >
                    <Label slot="label" htmlFor={"light-theme"}>
                        Light
                    </Label>
                </Radio>
                <Radio
                    inputId={"dark-theme"}
                    checked={themesApplied.includes(StandardLuminance.DarkMode)}
                    disabled={themesApplied.length === 0}
                    name="theme"
                    onChange={setDarkTheme}
                >
                    <Label slot="label" htmlFor={"dark-theme"}>
                        Dark
                    </Label>
                </Radio>
            </div>
        );
    }

    private setDesignSystemProperty<K extends keyof DesignSystem>(
        property: K,
        value: DesignSystem[K],
        nodeIds: string[]
    ): void {
        this.props.dispatch({
            type: MessageTypes.designSystem,
            action: MessageAction.assign,
            property,
            value,
            nodeIds,
        });
    }

    private deleteDesignSystemProperty<K extends keyof DesignSystem>(
        property: K,
        nodeIds: string[]
    ): void {
        this.props.dispatch({
            type: MessageTypes.designSystem,
            action: MessageAction.delete,
            property,
            nodeIds,
        });
    }
}
