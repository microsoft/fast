import * as React from "react";
import Site, {
    SiteCategory,
    SiteCategoryDocumentation,
    SiteCategoryItem,
    SiteProps,
    SiteTitle,
    SiteTitleBrand,
} from "@microsoft/fast-development-site-react";
import CSSEditor, {
    CSSEditorProps,
    CSSPosition,
    CSSPositionProps,
    PositionValue,
} from "../src";
import CSSEditorSchema from "../src/editor.schema.json";
import CSSPositionSchema from "../src/position/position.schema.json";

export interface AppState {
    editorDetail: CSSEditorProps;
    editorExample: CSSEditorProps;
    positionDetail: CSSPositionProps;
    positionExample: CSSPositionProps;
}

export enum EditorView {
    detail = "editorDetail",
    example = "editorExample",
    positionDetail = "positionDetail",
    positionExample = "positionExample",
}

class App extends React.Component<undefined, AppState> {
    public state: AppState;

    constructor(props: undefined) {
        super(props);

        this.state = {
            editorDetail: {
                position: PositionValue.static,
            },
            editorExample: {
                position: PositionValue.absolute,
                left: "4px",
                top: "12px",
            },
            positionDetail: {
                position: PositionValue.static,
            },
            positionExample: {
                position: PositionValue.absolute,
                left: "1px",
                top: "5px",
            },
        };
    }

    public render(): JSX.Element {
        return (
            <Site formChildOptions={[]}>
                <SiteTitle slot={"title"}>
                    <SiteTitleBrand>FAST</SiteTitleBrand> CSS React editor
                </SiteTitle>
                <SiteCategory slot={"category"} name={"Components"}>
                    <SiteCategory
                        slot={"category"}
                        name={"CSS Editor"}
                        schema={CSSEditorSchema}
                        component={CSSEditor}
                    >
                        <SiteCategoryDocumentation
                            slot={"canvas-detail-view-documentation"}
                        >
                            <div>CSS Editor</div>
                        </SiteCategoryDocumentation>
                        <SiteCategoryItem
                            slot={"canvas-example-view"}
                            data={Object.assign({}, this.state.editorExample, {
                                onChange: this.handleEditorExampleUpdate,
                            })}
                        />
                        <SiteCategoryItem
                            slot={"canvas-detail-view-example"}
                            data={Object.assign({}, this.state.editorDetail, {
                                onChange: this.handleEditorDetailUpdate,
                            })}
                        />
                    </SiteCategory>
                    <SiteCategory
                        slot={"category"}
                        name={"CSS Position"}
                        schema={CSSPositionSchema}
                        component={CSSPosition}
                    >
                        <SiteCategoryDocumentation
                            slot={"canvas-detail-view-documentation"}
                        >
                            <div>CSS Position</div>
                        </SiteCategoryDocumentation>
                        <SiteCategoryItem
                            slot={"canvas-example-view"}
                            data={Object.assign({}, this.state.positionExample, {
                                onChange: this.handlePositionExampleUpdate,
                            })}
                        />
                        <SiteCategoryItem
                            slot={"canvas-detail-view-example"}
                            data={Object.assign({}, this.state.positionDetail, {
                                onChange: this.handlePositionDetailUpdate,
                            })}
                        />
                    </SiteCategory>
                </SiteCategory>
            </Site>
        );
    }

    private handleEditorDetailUpdate = (updateEditorDetail: any): void => {
        this.handleExampleUpdate(updateEditorDetail, EditorView.detail);
    };

    private handleEditorExampleUpdate = (updateEditorExample: any): void => {
        this.handleExampleUpdate(updateEditorExample, EditorView.example);
    };

    private handleExampleUpdate = (updateExample: any, stateKey: EditorView): void => {
        const stateUpdate: Partial<AppState> = {};
        stateUpdate[stateKey] = updateExample;

        this.setState(stateUpdate as AppState);
    };

    private handlePositionDetailUpdate = (updatePositionDetail: any): void => {
        this.handleExampleUpdate(
            Object.assign(
                {},
                { onChange: this.state.positionDetail.onChange },
                updatePositionDetail
            ),
            EditorView.positionDetail
        );
    };

    private handlePositionExampleUpdate = (updatePositionExample: any): void => {
        this.handleExampleUpdate(
            Object.assign(
                {},
                { onChange: this.state.positionExample.onChange },
                updatePositionExample
            ),
            EditorView.positionExample
        );
    };
}

export default App;
