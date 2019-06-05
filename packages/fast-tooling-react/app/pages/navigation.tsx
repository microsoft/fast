import React from "react";
import { Navigation } from "../../src";
import childrenSchema from "./navigation/children.schema.json";
import { childOptions, children } from "./navigation/example.data";

export interface NavigationTestPageState {
    data: any;
    dragAndDropReordering: boolean;
}

class NavigationTestPage extends React.Component<{}, NavigationTestPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            data: children,
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
                    data={this.state.data}
                    schema={childrenSchema}
                    childOptions={childOptions}
                    onChange={this.handleChange}
                    dragAndDropReordering={this.state.dragAndDropReordering}
                />
            </div>
        );
    }

    private handleChange = (data: any): void => {
        this.setState({
            data,
        });
    };

    private handleUpdateDragAndDropReordering = (): void => {
        this.setState({
            dragAndDropReordering: !this.state.dragAndDropReordering,
        });
    };
}

export { NavigationTestPage };
