import React from "react";
import { ModularNavigation } from "../../src";
import childrenSchema from "./navigation/children.schema";
import { children } from "./navigation/example.data";
import { MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import noChildrenSchema from "./navigation/no-children.schema";

export interface NavigationTestPageState {
    navigation: any;
}

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
        };
    }

    public render(): React.ReactNode {
        return (
            <div>
                <ModularNavigation messageSystem={fastMessageSystem} />
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
}

export { NavigationTestPage };
