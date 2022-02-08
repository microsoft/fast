import React from "react";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { StandardLuminance, Swatch, SwatchRGB } from "@fluentui/web-components";
// import DetachIcon from "./assets/detach.svg";
// import RevertIcon from "./assets/revert.svg";
import { CornerRadius, Drawer, Swatch as SwatchComponent } from "./components";
import { DesignTokenType } from "./design-token-registry";
import { PluginUINodeData, UIController } from "./ui-controller";

/* tslint:disable:no-unused-expression */
CornerRadius;
Drawer;
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

        this.controller = new UIController((nodes) => this.dispatchState(nodes));
    }

    public render(): JSX.Element {
        this.controller.setSelectedNodes(this.props.selectedNodes);

        return this.renderBody();
    }

    private renderFooter(): JSX.Element {
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
                    <div style={{ display: "flex" }}>
                        <plugin-button
                            appearance="stealth"
                            aria-label={revertLabel}
                            onClick={this.controller.resetNodes.bind(this)}
                        >
                            Reset
                        </plugin-button>
                    </div>
                </div>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        const designTokens = this.controller.appliedDesignTokens();
        const layerRecipes = this.controller.appliedRecipes(DesignTokenType.layerFill);
        const backgroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.backgroundFill
        );
        const foregroundRecipes = this.controller.appliedRecipes(
            DesignTokenType.foregroundFill
        );
        const strokeRecipes = this.controller.appliedRecipes(DesignTokenType.strokeFill);
        const cornerRadiusRecipes = this.controller.appliedRecipes(
            DesignTokenType.cornerRadius
        );
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
                <div style={{ overflowY: "overlay" as any }}>
                    <td-drawer name="Theme">
                        <div slot="collapsed-content">
                            {designTokens.length ? (
                                <>
                                    {designTokens.map(designToken => (
                                        <p className="applied-recipe" key={designToken.definition.id}>
                                            <div className="horizontal">
                                                {designToken.definition.name}
                                            </div>
                                            <div>
                                                <span>
                                                    {designToken.value}
                                                </span>
                                                <plugin-button
                                                    appearance="stealth"
                                                    aria-label="Detach"
                                                    onClick={this.controller.removeDesignToken.bind(
                                                        this.controller,
                                                        designToken.definition
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
                            {supportsDesignSystem ? this.renderThemeSwitcher() : null}
                            {supportsDesignSystem
                                ? this.renderColorPicker("neutralBaseColor")
                                : null}
                            {supportsDesignSystem
                                ? this.renderColorPicker("accentBaseColor")
                                : null}
                        </div>
                    </td-drawer>
                    <td-drawer name="Color">
                        <div slot="collapsed-content">
                            {layerRecipes.length ? (
                                <>
                                    <p className="title inset">Layer</p>
                                    {layerRecipes.map(recipe => (
                                        <p className="applied-recipe" key={recipe.id}>
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
                                                    {this.controller
                                                        .getDefaultDesignTokenValue(
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
                                        <p className="applied-recipe" key={recipe.id}>
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
                                                    {this.controller
                                                        .getDefaultDesignTokenValue(
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
                                        <p className="applied-recipe" key={recipe.id}>
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
                                                    {this.controller
                                                        .getDefaultDesignTokenValue(
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
                                        <p className="applied-recipe" key={recipe.id}>
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
                                                    {this.controller
                                                        .getDefaultDesignTokenValue(
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
                                    <p className="title inset">Layer backgrounds</p>
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
                                node.supports.includes(DesignTokenType.backgroundFill)
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
                                node.supports.includes(DesignTokenType.foregroundFill)
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
                    <td-drawer name="Corner Radius">
                        {this.props.selectedNodes.some(node =>
                            node.supports.includes(DesignTokenType.cornerRadius)
                        ) ? (
                            <div className="swatch-grid" style={{ marginTop: 8 }}>
                                {this.controller
                                    .recipeOptionsByType(DesignTokenType.cornerRadius)
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
                </div>
                {this.renderFooter()}
            </div>
        );
    }

    private renderColorPicker(tokenId: string): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const colorToken = this.controller.getDesignTokenDefinition<Swatch>(tokenId)!;
        const defaultValue = this.controller
            .getDefaultDesignTokenValue(colorToken.token);
        const values = this.props.selectedNodes
            .map(node => this.controller.getDesignTokenValue(node, colorToken.token))
            .filter(value => !!value);

        let value = values.length ? values[0].toColorString() : defaultValue;

        const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            const hex: string = e.target.value;
            const parsed = parseColorHexRGB(hex);

            if (parsed instanceof ColorRGBA64) {
                value = parsed.toStringHexRGB();
                (document.getElementById(
                    colorToken.id + "Hex"
                ) as HTMLInputElement).value = value;
                const swatch = SwatchRGB.from(parsed);
                this.controller.assignDesignToken(colorToken, swatch);
            }
        };

        const onChangeHex = (e: React.FocusEvent<HTMLInputElement>): void => {
            const hex: string = e.target.value;
            const parsed = parseColorHexRGB(hex);

            if (parsed instanceof ColorRGBA64) {
                value = parsed.toStringHexRGB();
                (document.getElementById(
                    colorToken.id
                ) as HTMLInputElement).value = value;
                const swatch = SwatchRGB.from(parsed);
                this.controller.assignDesignToken(colorToken, swatch);
            }
        };

        const labelStyle = {
            fontFamily: "var(--body-font)",
            color: "var(--neutral-foreground-rest)",
            cursor: "pointer",
            fontSize: "var(--type-ramp-base-font-size)",
            lineHeight: "var(--type-ramp-base-line-height)",
            marginInlineEnd: "12px",
        };

        const inputStyle = {
            marginInlineStart: "12px",
        };

        return (
            <p className="inset">
                <label htmlFor={colorToken.id} style={labelStyle}>
                    {colorToken.name}
                </label>
                <input
                    type="color"
                    id={colorToken.id}
                    value={value}
                    onChange={onChange}
                ></input>
                <input
                    type="text"
                    id={colorToken.id + "Hex"}
                    style={inputStyle}
                    value={value}
                    onBlur={onChangeHex}
                ></input>
            </p>
        );
    }

    private renderThemeSwitcher(): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const def = this.controller.getDesignTokenDefinition<number>(
            "baseLayerLuminance"
        )!;
        const defaultValue = this.controller.getDefaultDesignTokenValue(def.token);
        const nodes = this.props.selectedNodes.filter(node =>
            node.supports.includes(DesignTokenType.designToken)
        );
        const themeData = nodes.map(node =>
            this.controller.getDesignTokenValue(node, def.token)
        );
        const themesApplied = themeData.filter(value => typeof value === "number");

        const lightModeOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.controller.assignDesignToken(def, StandardLuminance.LightMode);
        };

        const darkModeOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.controller.assignDesignToken(def, StandardLuminance.DarkMode);
        };

        // TODO handle multiple selection better.
        return (
            <div style={{ padding: "4px 16px 4px" }}>
                <plugin-radio-group
                    name="luminanceMode"
                    value={themesApplied.length ? themesApplied[0] : defaultValue}
                    disabled={themesApplied.length === 0}
                >
                    <plugin-radio
                        value={StandardLuminance.LightMode}
                        onClick={lightModeOnChange}
                    >
                        Light mode
                    </plugin-radio>
                    <plugin-radio
                        value={StandardLuminance.DarkMode}
                        onClick={darkModeOnChange}
                    >
                        Dark mode
                    </plugin-radio>
                </plugin-radio-group>
            </div>
        );
    }

    private dispatchState(selectedNodes: PluginUINodeData[]): void {
        this.props.dispatch(selectedNodes);
    }
}
