import React from "react";
import { ColorsDesignSystem } from "./design-system";
import { Swatch } from "./recipes";
interface AppProps {
    designSystem: ColorsDesignSystem;
    neutralBaseColor: Swatch;
    accentBaseColor: Swatch;
    showOnlyRecommendedBackgrounds: boolean;
}
declare class App extends React.Component<AppProps, {}> {
    private colorBlockScrollerRef;
    private containerStyleOverrides;
    private backgroundRecipes;
    render(): React.ReactNode;
    private handleGradientScroll;
    private renderColorBlockList;
    private renderColorBlock;
    private backgrounds;
    private resolveRecipes;
    private get lightModeLayers();
    private get darkModeLayers();
}
declare const _default: import("react-redux").ConnectedComponentClass<
    typeof App,
    Pick<AppProps, never>
>;
export default _default;
