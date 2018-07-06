import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import CSSPositionSchema from "../../src/position/position.schema.json";
import { CSSPosition, ICSSPositionProps, PositionValue } from "../../src";

const name: string = "css-position";

const exampleData: ICSSPositionProps = {
    position: PositionValue.static,
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const detailData: ICSSPositionProps = {
    position: PositionValue.absolute,
    top: 5,
    left: 12,
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples = {
    name,
    component: CSSPosition,
    schema: CSSPositionSchema,
    detailData,
    data: [
        exampleData
    ]
} as ISnapshotTestSuite<ICSSPositionProps>;

describe(name, () => {
    generateSnapshots(examples);
});
