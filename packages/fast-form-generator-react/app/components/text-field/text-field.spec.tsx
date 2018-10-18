import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import * as textFieldSchema from "./text-field.schema.json";

const name: string = "text-field";

const exampleData: FormProps = {
    schema: textFieldSchema,
    data: getExample(textFieldSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [exampleData],
};

describe(name, () => {
    generateSnapshots(examples);
});
