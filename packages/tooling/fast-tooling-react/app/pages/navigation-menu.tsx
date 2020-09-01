import React from "react";
import { MenuItem, NavigationMenu } from "../../src";
import {
    accentColorName,
    L1ColorName,
    L4ColorName,
    textColorName,
    L3FillColorName,
    inactiveTextColorName,
    L3OutlineColorName,
} from "../../src/style";

const menu: MenuItem[] = [
    {
        displayName: "foo",
        location: "foo",
    },
    {
        displayName: "bar",
        location: "bar",
        items: [
            {
                displayName: "bar1",
                location: "bar1",
            },
            {
                displayName: "bar2",
                items: [
                    {
                        displayName: "bar2_1",
                        location: "bar2_1",
                        items: [
                            {
                                displayName: "bar2_1_1",
                                location: "bar2_1_1",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        displayName: "bat",
        location: "bat",
    },
];

const CSSpropertyOverrides = {
    [accentColorName]: "blue",
    [L1ColorName]: "white",
    [L4ColorName]: "lightslategray",
    [textColorName]: "darkred",
    [L3FillColorName]: "white",
    [inactiveTextColorName]: "orange",
    [L3OutlineColorName]: "orange",
};

export interface NavigationMenuTestPageState {
    expanded: boolean;
    location?: string;
    triggerLocationUpdate?: boolean;
    cssPropertyOverrides: boolean;
}

class NavigationMenuTestPage extends React.Component<{}, NavigationMenuTestPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            expanded: void 0,
            triggerLocationUpdate: false,
            cssPropertyOverrides: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div style={this.state.cssPropertyOverrides ? CSSpropertyOverrides : {}}>
                <button onClick={this.handleExpandClick}>expand</button>
                <button onClick={this.handleCollapseClick}>collapse</button>
                <button
                    onClick={this.handleTriggerLocationUpdate}
                    style={this.getStyle("triggerLocationUpdate")}
                >
                    manually trigger location update
                </button>
                <input
                    id={"useCSSOverrides"}
                    type={"checkbox"}
                    value={this.state.cssPropertyOverrides.toString()}
                    onChange={this.handleCSSOverrideUpdate}
                />
                <label htmlFor={"useCSSOverrides"}>Show CSS property overrides</label>
                <NavigationMenu
                    menu={menu}
                    expanded={this.state.expanded}
                    activeLocation={this.state.location}
                    onLocationUpdate={
                        this.state.triggerLocationUpdate
                            ? this.handleLocationUpdate
                            : void 0
                    }
                />
                <pre>location - {this.state.location}</pre>
                <pre>{JSON.stringify(menu, null, 2)}</pre>
            </div>
        );
    }

    private handleCSSOverrideUpdate = (): void => {
        this.setState({
            cssPropertyOverrides: !this.state.cssPropertyOverrides,
        });
    };

    private handleExpandClick = (): void => {
        this.setState(
            {
                expanded: true,
            },
            () => {
                this.setState({
                    expanded: void 0,
                });
            }
        );
    };

    private handleCollapseClick = (): void => {
        this.setState(
            {
                expanded: false,
            },
            () => {
                this.setState({
                    expanded: void 0,
                });
            }
        );
    };

    private handleLocationUpdate = (location: string): void => {
        this.setState({
            location,
        });
    };

    private handleTriggerLocationUpdate = (): void => {
        this.setState({
            triggerLocationUpdate: !this.state.triggerLocationUpdate,
        });
    };

    private getStyle(stateKey: string): any {
        if (this.state[stateKey]) {
            return {
                background: "#414141",
                color: "white",
            };
        }
    }
}

export { NavigationMenuTestPage };
