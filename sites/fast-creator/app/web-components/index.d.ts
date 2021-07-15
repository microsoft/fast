import React from "react";
import { MessageSystem } from "@microsoft/fast-tooling";
import { StandardControlPlugin } from "@microsoft/fast-tooling-react";
export declare function renderDevToolToggle(
    selected: boolean,
    onToggleCallback: () => void
): JSX.Element;
export declare function renderDeviceSelect(
    selectedDeviceId: string,
    onChangeCallback: (deviceId: string) => void,
    disable: boolean
): React.ReactNode;
export declare function getColorPickerControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[];
export declare function getSliderControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[];
export declare function renderNavigationTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    addedLibraries: string[],
    handleAddLibrary: (libraryId: string) => void,
    handleNavigationTabsVisibility: (navigationId: any) => void
): React.ReactNode;
export declare function renderFormTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    fastDesignMessageSystem: MessageSystem,
    linkedDataControl: StandardControlPlugin,
    handleFormVisibility: (formId: any) => void,
    handleDesignSystemChange: (updatedData: { [key: string]: unknown }) => void
): React.ReactNode;
export interface CSSLayoutProps {
    onChange: (config: { [key: string]: string }) => void;
    webComponentKey: string;
    value: {
        [key: string]: string;
    };
}
export declare class CSSLayout extends React.Component<CSSLayoutProps, {}> {
    layoutRef: React.RefObject<any>;
    private setLayoutRef;
    render(): JSX.Element;
}
export declare function renderPreviewSwitch(
    switchState: boolean,
    onChangeCallback: (newState: boolean) => void,
    disable: boolean
): React.ReactNode;
