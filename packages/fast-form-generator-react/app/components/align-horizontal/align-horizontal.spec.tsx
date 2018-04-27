import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import config from "./align-horizontal.config";
import { IAlignHorizontalProps } from "./align-horizontal";
import * as alignHorizontalSchema from "./align-horizontal.schema.json";

const name: string = "align-horizontal";

const exampleData: IFormProps = {
    schema: alignHorizontalSchema,
    data: getExample(alignHorizontalSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
    componentMappingToPropertyNames: config
};

const examples: ISnapshotTestSuite<IFormProps> = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
