import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import CSSEditorSchema from "../../src/editor.schema.json";
import CSSEditor, { ICSSEditorProps, PositionValue } from "../../src";

const name: string = "css-editor";

const exampleData: ICSSEditorProps = {
    position: PositionValue.static,
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const detailData: ICSSEditorProps = {
    position: PositionValue.absolute,
    bottom: 8,
    right: 4,
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples: ISnapshotTestSuite<ICSSEditorProps> = {
    name,
    component: CSSEditor,
    schema: CSSEditorSchema,
    detailData,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
