import { Caption, Divider, Label, Radio } from "@microsoft/fast-components-react-msft";
import React from "react";
import { MessageTypes, RecipeMessageAction, UIMessage } from "../messaging";
import { RecipeData, RecipeTypes } from "../recipe-registry";
import Swatch from "./swatch";

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
            action: RecipeMessageAction.assign,
        });
    };
}
