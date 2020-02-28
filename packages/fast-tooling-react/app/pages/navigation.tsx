import React from "react";
import { Navigation } from "../../src";
import childrenSchema from "./navigation/children.schema";
import { children } from "./navigation/example.data";
import { MessageSystem, MessageSystemType } from "../../src/message-system";
import noChildrenSchema from "./navigation/no-children.schema";

export interface NavigationTestPageState {
    navigation: any;
    dragAndDropReordering: boolean;
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
            dragAndDropReordering: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div>
                <input
                    type={"checkbox"}
                    id={"dragAndDropReordering"}
                    value={this.state.dragAndDropReordering.toString()}
                    onChange={this.handleUpdateDragAndDropReordering}
                />
                <label htmlFor={"dragAndDropReordering"}>Drag and drop reordering</label>
                <Navigation
                    messageSystem={fastMessageSystem}
                    dragAndDropReordering={this.state.dragAndDropReordering}
                />
                <pre>{JSON.stringify(this.state.navigation, null, 2)}</pre>
            </div>
        );
    }

    private handleUpdateDragAndDropReordering = (): void => {
        this.setState({
            dragAndDropReordering: !this.state.dragAndDropReordering,
        });
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data) {
            if (e.data.type === MessageSystemType.initialize) {
                this.setState({
                    navigation: e.data.navigationDictionary,
                });
            }
        }
    };
}

export { NavigationTestPage };
