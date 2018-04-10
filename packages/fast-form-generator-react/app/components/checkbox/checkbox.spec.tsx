import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as checkboxSchema from "./checkbox.schema.json";

const name: string = "checkbox";

const exampleData: IFormProps = {
    schema: checkboxSchema,
    data: getExample(checkboxSchema),
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
