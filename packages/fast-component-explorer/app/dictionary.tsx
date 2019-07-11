import style from "./dictionary.style";
import { NavigationMenu } from "@microsoft/fast-tooling-react";
import manageJss, { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import {
    Background,
    DarkModeBackgrounds,
    LightModeBackgrounds,
} from "@microsoft/fast-components-react-msft";
import { DictionaryHandledProps } from "./dictionary.props";
import { history, menu } from "./config";

class Dictionary extends Foundation<DictionaryHandledProps, {}, {}> {
    public static displayName: string = "Explorer";

    protected handledProps: HandledProps<DictionaryHandledProps> = {
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <DesignSystemProvider designSystem={DesignSystemDefaults}>
                <Background value={this.backgrounds.L1}>
                    <NavigationMenu
                        menu={menu}
                        expanded={true}
                        onLocationUpdate={this.handleUpdateRoute}
                    />
                </Background>
            </DesignSystemProvider>
        );
    }

    private handleUpdateRoute = (route: string): void => {
        history.push(route);
    };

    private get backgrounds(): typeof DarkModeBackgrounds | typeof LightModeBackgrounds {
        return DarkModeBackgrounds;
    }
}

export default manageJss(style)(Dictionary);
