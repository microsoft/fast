import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import config from "./align-horizontal.config";
import * as alignHorizontalSchema from "./align-horizontal.schema.json";

const name: string = "align-horizontal";

const exampleData: IFormProps = {
    schema: alignHorizontalSchema,
    data: getExample(alignHorizontalSchema),
    onChange: (data: any): void => {},
    componentMappingToPropertyNames: config
}

const examples = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
