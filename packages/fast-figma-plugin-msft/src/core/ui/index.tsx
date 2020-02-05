import React from "react";
import { PluginNodeData } from "../node";
import { MappedRecipeTypes } from "../recipes";
import {
    Caption,
    Divider,
    Label,
    Paragraph,
    Radio,
} from "@microsoft/fast-components-react-msft";
import Swatch from "./swatch";
/**
 * Defines all data associated with a recipe
 */
export interface RecipeOptionData {
    name: string;
    value: string;
    id: string;
}

export interface PluginUIActiveNodeRecipeSupportOptions {
    label: string;
    options: RecipeOptionData[];
}

export interface PluginUIActiveNodeData extends PluginNodeData {
    id: string;
    type: string;
    supports: Partial<MappedRecipeTypes<PluginUIActiveNodeRecipeSupportOptions>>;
}

export interface PluginUIProps {
    selectedNodes: PluginUIActiveNodeData[];
}

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
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
        if (this.props.selectedNodes.length > 1) {
            return <Paragraph>Select a single node to edit.</Paragraph>;
        } else if (this.props.selectedNodes.length === 0) {
            return <Paragraph>No editable nodes selected</Paragraph>;
        } else {
            return <div>{this.renderRecipeSelector(this.props.selectedNodes[0])}</div>;
        }
    }

    private renderRecipeSelector(node: PluginUIActiveNodeData): JSX.Element[] {
        return Object.entries(node.supports).map(entry => {
            const [name, data] = entry;

            return (
                <fieldset key={name} style={{ border: "none" }}>
                    <legend>{data!.label}</legend>
                    {data!.options.map(option => (
                        <Radio
                            key={option.id}
                            inputId={option.id}
                            name={name}
                            style={{ margin: "2px 0" }}
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
        });
    }
}
