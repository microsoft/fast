import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import CSSPositionSchema from "../../src/position/position.schema.json";
import { CSSPosition, CSSPositionProps, PositionValue } from "../../src";

const name: string = "css-position";

const exampleData: CSSPositionProps = {
    position: PositionValue.static,
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const detailData: CSSPositionProps = {
    position: PositionValue.absolute,
    top: "5px",
    left: "12px",
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples: SnapshotTestSuite<CSSPositionProps> = {
    name,
    component: CSSPosition,
    schema: CSSPositionSchema,
    detailData,
    data: [exampleData]
};

describe(name, () => {
    generateSnapshots(examples);
});
