import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as oneOfSchema from "./one-of.schema.json";

const name: string = "one-of";

const exampleData: IFormProps = {
    schema: oneOfSchema,
    data: getExample(oneOfSchema),
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
