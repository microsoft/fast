import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as textFieldSchema from "./text-field.schema.json";

const name: string = "text-field";

const exampleData: IFormProps = {
    schema: textFieldSchema,
    data: getExample(textFieldSchema),
    onChange: (data: any): void => {}
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
