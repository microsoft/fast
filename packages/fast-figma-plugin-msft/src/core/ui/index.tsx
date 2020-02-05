import React from "react";
import { PluginNodeData } from "../node";
import {
    Caption,
    Divider,
    Label,
    Paragraph,
    Radio,
} from "@microsoft/fast-components-react-msft";
import Swatch from "./swatch";
import { RecipeTypes, RecipeData } from "../recipe-registry";

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
    supports: RecipeTypes[];
}

export interface RecipeTypeOptions {
    type: RecipeTypes;
    options: RecipeData[];
}

export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
    recipeOptions: RecipeTypeOptions[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
        recipeOptions: [],
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
                    {this.props.selectedNodes.map(node => node.type).join(" | ") || "N/A"}
                </Caption>
            </div>
        );
    }

    private renderBody(): JSX.Element {
        // return <pre>{JSON.stringify(this.props, null, 2)}</pre>

        // if (this.props.selectedNodes.length > 1) {
        //     return <Paragraph>Select a single node to edit.</Paragraph>;
        // } else if (this.props.selectedNodes.length === 0) {
        //     return <Paragraph>No editable nodes selected</Paragraph>;
        // } else {
        // return <div>{this.renderRecipeSelector(this.props.selectedNodes[0])}</div>;
        // }
        return <div>{this.props.recipeOptions.map(this.renderRecipeSelector)}</div>;
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
                        checked={this.recipeIsAssigned(option.id).length > 1}
                        onChange={this.handleOnChange.bind(this, option.id)}
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

    private handleOnChange = (recipeId: string): void => {
        console.log(recipeId);
    };
}
