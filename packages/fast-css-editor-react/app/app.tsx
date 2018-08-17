import * as React from "react";
import Site, {
    ISiteProps,
    SiteCategory,
    SiteCategoryDocumentation,
    SiteCategoryItem,
    SiteTitle,
    SiteTitleBrand
} from "@microsoft/fast-development-site-react";
import CSSEditor, { CSSPosition, ICSSEditorProps, ICSSPositionProps, PositionValue } from "../src";
import CSSEditorSchema from "../src/editor.schema.json";
import CSSPositionSchema from "../src/position/position.schema.json";

export interface IAppState {
    editorDetail: ICSSEditorProps;
    editorExample: ICSSEditorProps;
    positionDetail: ICSSPositionProps;
    positionExample: ICSSPositionProps;
}

export enum EditorView {
    detail = "editorDetail",
    example = "editorExample",
    positionDetail = "positionDetail",
    positionExample = "positionExample"
}

class App extends React.Component<{}, IAppState> {
    public state: IAppState;

    constructor(props) {
        super(props);

        this.state = {
            editorDetail: {
                position: PositionValue.static,
            },
            editorExample: {
                position: PositionValue.absolute,
                left: "4px",
                top: "12px"
            },
            positionDetail: {
                position: PositionValue.static
            },
            positionExample: {
                position: PositionValue.absolute,
                left: "1px",
                top: "5px"
            }
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
                        <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
                            <div>
                                CSS Editor
                            </div>
                        </SiteCategoryDocumentation>
                        <SiteCategoryItem
                            slot={"canvas-example-view"}
                            data={Object.assign({}, this.state.editorExample, {onChange: this.handleEditorExampleUpdate})}
                        />
                        <SiteCategoryItem
                            slot={"canvas-detail-view-example"}
                            data={Object.assign({}, this.state.editorDetail, {onChange: this.handleEditorDetailUpdate})}
                        />
                    </SiteCategory>
                    <SiteCategory
                        slot={"category"}
                        name={"CSS Position"}
                        schema={CSSPositionSchema}
                        component={CSSPosition}
                    >
                        <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
                            <div>
                                CSS Position
                            </div>
                        </SiteCategoryDocumentation>
                        <SiteCategoryItem
                            slot={"canvas-example-view"}
                            data={Object.assign({}, this.state.positionExample, {onChange: this.handlePositionExampleUpdate})}
                        />
                        <SiteCategoryItem
                            slot={"canvas-detail-view-example"}
                            data={Object.assign({}, this.state.positionDetail, {onChange: this.handlePositionDetailUpdate})}
                        />
                    </SiteCategory>
                </SiteCategory>
            </Site>
        );
    }

    private handleEditorDetailUpdate = (updateEditorDetail: any): void => {
        this.handleExampleUpdate(updateEditorDetail, EditorView.detail);
    }

    private handleEditorExampleUpdate = (updateEditorExample: any): void => {
        this.handleExampleUpdate(updateEditorExample, EditorView.example);
    }

    private handleExampleUpdate = (updateExample: any, stateKey: EditorView): void => {
        const stateUpdate: Partial<IAppState> = {};
        stateUpdate[stateKey] = updateExample;

        this.setState(stateUpdate as IAppState);
    }

    private handlePositionDetailUpdate = (updatePositionDetail: any): void => {
        this.handleExampleUpdate(
            Object.assign({}, { onChange: this.state.positionDetail.onChange }, updatePositionDetail),
            EditorView.positionDetail,
        );
    }

    private handlePositionExampleUpdate = (updatePositionExample: any): void => {
        this.handleExampleUpdate(
            Object.assign({}, { onChange: this.state.positionExample.onChange }, updatePositionExample),
            EditorView.positionExample,
        );
    }
}

export default App;
