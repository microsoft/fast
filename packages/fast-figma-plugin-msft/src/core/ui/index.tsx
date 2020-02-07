import {
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
import { startCase } from "lodash-es";

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
        return (
            <div>
                <Divider style={{ marginBottom: "4px" }} />
                <Caption>
                    {this.props.selectedNodes
                        .map(node => `${node.type} - ${node.id}`)
                        .join(" | ") || "N/A"}
                </Caption>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        return (
            <div>
                {this.props.selectedNodes.some(node =>
                    node.supports.includes("designSystem")
                )
                    ? this.renderThemeSwitcher()
                    : null}
                {this.props.recipeOptions.map(this.renderRecipeSelector)}
            </div>
        );
    }

    private renderRecipeSelector = (optionType: RecipeTypeOptions): JSX.Element => {
        return (
            <fieldset key={optionType.type} style={{ border: "none" }}>
                <legend>{optionType.type}</legend>
                {optionType.options.map(option => (
                    <Radio
                        key={option.id}
                        inputId={option.id}
                        name={name}
                        style={{ margin: "2px 0" }}
                        checked={!!this.recipeIsAssigned(option.id).length}
                        onChange={this.handleOnChange.bind(this, option.id, option.type)}
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

    private handleOnChange = (recipeId: string, type: RecipeTypes): void => {
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

        const removeTheme = this.removeDesignSystemProperty.bind(this, key, nodeIds);

        return (
            <div>
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

    private removeDesignSystemProperty<K extends keyof DesignSystem>(
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
