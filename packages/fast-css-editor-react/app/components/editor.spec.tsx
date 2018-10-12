import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import CSSEditorSchema from "../../src/editor.schema.json";
import CSSEditor, { CSSEditorProps, PositionValue } from "../../src";
import { noop } from "lodash-es";

const name: string = "css-editor";

const exampleData: CSSEditorProps = {
    position: PositionValue.static,
    onChange: noop
};

const detailData: CSSEditorProps = {
    position: PositionValue.absolute,
    bottom: "8",
    right: "8",
    onChange: noop
};

const examples: SnapshotTestSuite<CSSEditorProps> = {
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
