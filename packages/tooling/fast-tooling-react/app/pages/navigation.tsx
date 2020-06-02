import React from "react";
import { ModularNavigation } from "../../src";
import childrenSchema from "./navigation/children.schema";
import { children } from "./navigation/example.data";
import { MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
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
        };
    }

    public render(): React.ReactNode {
        return (
            <div style={this.state.cssPropertyOverrides ? CSSpropertyOverrides : {}}>
                <ModularNavigation messageSystem={fastMessageSystem} />
                <input
                    id={"useCSSOverrides"}
                    type={"checkbox"}
                    value={this.state.cssPropertyOverrides.toString()}
                    onChange={this.handleCSSOverrideUpdate}
                />
                <label htmlFor={"useCSSOverrides"}>Show CSS property overrides</label>
                <pre>{JSON.stringify(this.state.navigation, null, 2)}</pre>
            </div>
        );
    }

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
