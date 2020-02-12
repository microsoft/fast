import {
    ActionTrigger,
    ActionTriggerAppearance,
    Caption,
    Checkbox,
    Divider,
    Label,
    Radio,
} from "@microsoft/fast-components-react-msft";
import React from "react";
import { MessageAction, MessageTypes, UIMessage } from "../messaging";
import { RecipeData, RecipeTypes } from "../recipe-registry";
import Swatch from "./swatch";
import { DesignSystem, StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { refresh, revertChanges } from "./glyphs";

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
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {this.renderBody()}
                {this.renderFooter()}
            </div>
        );
    }

    private renderFooter(): JSX.Element {
        const refreshLabel = "Sync selected - will re-evaluate all applied recipes.";
        const revertLabel = "Remove all plugin data from the current selection.";

        return (
            <div>
                <Divider />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 0",
                    }}
                >
                    <Caption
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {this.props.selectedNodes
                            .map(node => `${node.type} - ${node.id}`)
                            .join(" | ") || "N/A"}
                    </Caption>
                    <div style={{ display: "flex" }}>
                        <ActionTrigger
                            glyph={refresh}
                            appearance={ActionTriggerAppearance.stealth}
                            title={refreshLabel}
                            aria-label={refreshLabel}
                            onClick={this.props.dispatch.bind(this, {
                                type: MessageTypes.sync,
                                nodeIds: this.props.selectedNodes.map(node => node.id),
                            })}
                        />
                        <ActionTrigger
                            glyph={revertChanges}
                            appearance={ActionTriggerAppearance.stealth}
                            title={revertLabel}
                            aria-label={revertLabel}
                            onClick={this.props.dispatch.bind(this, {
                                type: MessageTypes.reset,
                                nodeIds: this.props.selectedNodes.map(node => node.id),
                            })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        return (
            <div style={{ overflowY: "auto" }}>
                {this.props.selectedNodes.some(node =>
                    node.supports.includes("designSystem")
                )
                    ? this.renderThemeSwitcher()
                    : null}
                {this.props.recipeOptions
                    .sort((a, b) => {
                        return a.type < b.type ? -1 : a.type > b.type ? 1 : 0;
                    })
                    .map(this.renderRecipeSelector)}
            </div>
        );
    }

    private renderRecipeSelector = (optionType: RecipeTypeOptions): JSX.Element => {
        const anySelected = optionType.options.some(
            option => !!this.recipeIsAssigned(option.id).length
        );
        const noneId = optionType.type + "none";
        return (
            <fieldset
                key={optionType.type}
                style={{
                    border: "none",
                    padding: "0",
                    margin: "12px 0",
                    display: "flex",
                }}
            >
                <legend>{optionType.type}</legend>
                <Radio
                    key={noneId}
                    inputId={noneId}
                    name={optionType.type}
                    style={{ margin: "2px 0" }}
                    checked={!anySelected}
                    onChange={this.removeRecipe.bind(this, optionType.type)}
                >
                    <Label
                        slot="label"
                        htmlFor={noneId}
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <Swatch color={"#FFF"} />
                        None
                    </Label>
                </Radio>
                {optionType.options.map(option => (
                    <Radio
                        key={option.id}
                        inputId={option.id}
                        name={optionType.type}
                        style={{ margin: "2px 0" }}
                        checked={!!this.recipeIsAssigned(option.id).length}
                        onChange={this.setRecipe.bind(this, option.id, option.type)}
                    >
                        <Label
                            slot="label"
                            htmlFor={option.id}
                            style={{ display: "inline-flex", alignItems: "center" }}
                        >
                            <Swatch color={option.value} />
                            {option.name}
                        </Label>
                    </Radio>
                ))}
            </fieldset>
        );
    };

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
            <div style={{ marginTop: "4px" }}>
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
