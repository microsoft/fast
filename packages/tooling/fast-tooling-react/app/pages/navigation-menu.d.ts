import React from "react";
export interface NavigationMenuTestPageState {
    expanded: boolean;
    location?: string;
    triggerLocationUpdate?: boolean;
    cssPropertyOverrides: boolean;
}
declare class NavigationMenuTestPage extends React.Component<
    {},
    NavigationMenuTestPageState
> {
    constructor(props: {});
    render(): React.ReactNode;
    private handleCSSOverrideUpdate;
    private handleExpandClick;
    private handleCollapseClick;
    private handleLocationUpdate;
    private handleTriggerLocationUpdate;
    private getStyle;
}
export { NavigationMenuTestPage };
