import React from "react";
import { ModularNavigation } from "../../src";
import childrenSchema from "./navigation/children.schema";
import { children } from "./navigation/example.data";
import { DataType, MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import noChildrenSchema from "./navigation/no-children.schema";
import {
    accentColorName,
    L1ColorName,
    L3ColorName,
    textColorName,
    L3FillColorName,
    inactiveTextColorName,
    L3OutlineColorName,
} from "../../src/style";

export interface NavigationTestPageState {
    navigation: any;
    cssPropertyOverrides: boolean;
    types?: DataType[];
}

const CSSpropertyOverrides = {
    [accentColorName]: "blue",
    [L1ColorName]: "white",
    [L3ColorName]: "lightslategray",
    [textColorName]: "darkred",
    [L3FillColorName]: "white",
    [inactiveTextColorName]: "orange",
    [L3OutlineColorName]: "orange",
};

let fastMessageSystem: MessageSystem;

class NavigationTestPage extends React.Component<{}, NavigationTestPageState> {
    constructor(props: {}) {
        super(props);

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: children,
                schemaDictionary: {
                    [childrenSchema.id]: childrenSchema,
                    [noChildrenSchema.id]: noChildrenSchema,
                },
            });
        }

        fastMessageSystem.add({
            onMessage: this.handleMessageSystem,
        });

        this.state = {
            navigation: null,
            cssPropertyOverrides: false,
            types: undefined,
        };
    }

    public render(): React.ReactNode {
        return (
            <div style={this.state.cssPropertyOverrides ? CSSpropertyOverrides : {}}>
                <input
                    id={"useCSSOverrides"}
                    type={"checkbox"}
                    value={this.state.cssPropertyOverrides.toString()}
                    onChange={this.handleCSSOverrideUpdate}
                />
                <label htmlFor={"useCSSOverrides"}>Show CSS property overrides</label>
                <br />
                <fieldset>
                    <legend>Allow types</legend>
                    <input
                        id={"allowArrays"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.array)
                        }`}
                        onChange={this.handleIncludeType(DataType.array)}
                    />
                    <label htmlFor={"allowArrays"}>Allow arrays</label>
                    <br />
                    <input
                        id={"allowObjects"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.object)
                        }`}
                        onChange={this.handleIncludeType(DataType.object)}
                    />
                    <label htmlFor={"allowArrays"}>Allow objects</label>
                    <br />
                    <input
                        id={"allowBooleans"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.boolean)
                        }`}
                        onChange={this.handleIncludeType(DataType.boolean)}
                    />
                    <label htmlFor={"allowBooleans"}>Allow booleans</label>
                    <br />
                    <input
                        id={"allowStrings"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.string)
                        }`}
                        onChange={this.handleIncludeType(DataType.string)}
                    />
                    <label htmlFor={"allowStrings"}>Allow strings</label>
                    <br />
                    <input
                        id={"allowNumbers"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.number)
                        }`}
                        onChange={this.handleIncludeType(DataType.number)}
                    />
                    <label htmlFor={"allowNumbers"}>Allow numbers</label>
                    <br />
                    <input
                        id={"allowNulls"}
                        type={"checkbox"}
                        value={`${
                            Array.isArray(this.state.types) &&
                            !!this.state.types.find(type => type === DataType.null)
                        }`}
                        onChange={this.handleIncludeType(DataType.null)}
                    />
                    <label htmlFor={"allowNulls"}>Allow null</label>
                </fieldset>
                <ModularNavigation
                    messageSystem={fastMessageSystem}
                    types={this.state.types}
                />

                <pre>{JSON.stringify(this.state.types, null, 2)}</pre>
                <pre>{JSON.stringify(this.state.navigation, null, 2)}</pre>
            </div>
        );
    }

    private handleIncludeType = (
        type: DataType
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            let currentTypes: DataType[] = [].concat(this.state.types || []);

            if (e.target.checked) {
                currentTypes.push(type);
            } else {
                const indexOfType = currentTypes.findIndex(
                    currentType => currentType === type
                );

                currentTypes.splice(indexOfType, 1);
            }

            if (currentTypes.length === 0) {
                currentTypes = undefined;
            }

            this.setState({
                types: currentTypes,
            });
        };
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data && e.data.type === MessageSystemType.initialize) {
            this.setState({
                navigation: e.data.navigationDictionary,
            });
        }
    };

    private handleCSSOverrideUpdate = (): void => {
        this.setState({
            cssPropertyOverrides: !this.state.cssPropertyOverrides,
        });
    };
}

export { NavigationTestPage };
