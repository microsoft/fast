import React from "react";
import { Editor } from "@microsoft/site-utilities";
import { ExplorerProps, ExplorerState } from "./explorer.props";
declare class Explorer extends Editor<ExplorerProps, ExplorerState> {
    static displayName: string;
    webComponentEditorContainerRef: HTMLElement;
    editorContainerRef: React.RefObject<HTMLDivElement>;
    viewerContainerRef: React.RefObject<HTMLDivElement>;
    private windowResizing;
    constructor(props: ExplorerProps);
    render(): React.ReactNode;
    componentDidMount(): void;
    private handleWindowPopState;
    private handleWindowResize;
    private updateMonacoEditor;
    private handleMessageSystem;
    private renderScenarioSelect;
    private getComponentNameSpinalCaseByPath;
    private getScenarioData;
    private handleUpdateScenario;
    private handleUpdateRoute;
    private handleDevToolsToggle;
    private handlePivotUpdate;
}
export default Explorer;
