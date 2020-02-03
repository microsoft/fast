import React from "react";
import { PluginNodeData, RecipeData } from "./node";
import {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import {
    Caption,
    Checkbox,
    Divider,
    DividerClassNameContract,
    Label,
    LabelClassNameContract,
    NeutralButton,
    Paragraph,
    Radio,
    Select,
    SelectOption,
} from "@microsoft/fast-components-react-msft";

export interface PluginUISelectedNodeData extends Partial<PluginNodeData> {
    id: string;
    type: string;
    fillOptions: RecipeData[];
    strokeOptions: RecipeData[];
}

export interface PluginUIProps {
    selectedNodes: PluginUISelectedNodeData[];
}

const dividerStyleOverrides: ComponentStyleSheet<
    DividerClassNameContract,
    DesignSystem
> = {
    divider: {
        margin: "20px 0 8px 0",
    },
};
const recipeLabelStyleOverrides: ComponentStyleSheet<
    LabelClassNameContract,
    DesignSystem
> = {
    label: {
        margin: "8px 0 2px",
    },
};

export class PluginUI extends React.Component<PluginUIProps> {
    public static defaultProps: PluginUIProps = {
        selectedNodes: [],
    };

    private designSystem: DesignSystem = { ...DesignSystemDefaults, density: -2 };

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={this.designSystem}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <pre>{JSON.stringify(this.props, null, 2)}</pre>
                    <div>
                        <Divider jssStyleSheet={dividerStyleOverrides} />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Caption>
                                {this.props.selectedNodes
                                    .map(data => data.type)
                                    .join("  |  ") || "N/A"}
                            </Caption>
                        </div>
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }

    // private renderRecipeSelectors(): JSX.Element {
    //     if (this.props.selectedNodes.length > 1) {
    //         return <p>We can only update one node at a time!</p>;
    //     } else if (this.props.selectedNodes.length === 0) {
    //         return <p>No nodes selected</p>;
    //     }

    //     return this.renderRecipeSelectorsForNode(this.props.selectedNodes[0]);
    // }

    // private renderRecipeSelectorsForNode(
    //     nodeData: PluginUISelectedNodeData
    // ): JSX.Element {
    //     const val = Object.keys(nodeData).filter(key => recipeTypes.includes(key as any));

    //     return (
    //         <React.Fragment>
    //             {val.map(value =>
    //                 this.renderRecipeSelect(value as RecipeTypes, nodeData[value])
    //             )}
    //         </React.Fragment>
    //     );
    // }

    // private renderRecipeSelect(name: RecipeTypes, options: RecipeData[]): JSX.Element {
    //     const id = name;
    //     const active = options.filter(value => value.active);
    //     const unset = {
    //         name: "-",
    //         value: "",
    //         active: !!active.length,
    //     };

    //     const onChange = (newValue: string) => {
    //         // TODO: integrate proper dispatching
    //         console.log({
    //             type: "setNodeData",
    //             key: name,
    //             value: {
    //                 name: newValue,
    //                 value: options.find(option => option.name === newValue)!.value,
    //             },
    //         });
    //     };

    //     return (
    //         <React.Fragment>
    //             <Label htmlFor={id} jssStyleSheet={recipeLabelStyleOverrides}>
    //                 {name}
    //             </Label>
    //             <Select
    //                 id={id}
    //                 selectedItems={
    //                     active.length ? active.map(value => value.name) : [unset.name]
    //                 }
    //                 onValueChange={onChange}
    //             >
    //                 {[unset].concat(options).map(this.renderRecipeOption)}
    //             </Select>
    //         </React.Fragment>
    //     );
    // }

    // private renderRecipeOption(option: RecipeData): JSX.Element {
    //     const { name, value } = option;
    //     return <SelectOption id={name} key={name} value={name} children={name} />;
    // }
}
