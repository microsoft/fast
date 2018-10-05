import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import * as numberFieldSchema from "./number-field.schema.json";

const name: string = "number-field";

const exampleData: FormProps = {
    schema: numberFieldSchema,
    data: getExample(numberFieldSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
