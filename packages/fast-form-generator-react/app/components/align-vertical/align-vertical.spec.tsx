import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import config from "./align-vertical.config";
import * as alignVerticalSchema from "./align-vertical.schema.json";

const name: string = "align-vertical";

const exampleData: IFormProps = {
    schema: alignVerticalSchema,
    data: getExample(alignVerticalSchema),
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
