import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as anyOfSchema from "./any-of.schema.json";

const name: string = "any-of";

const exampleData: IFormProps = {
    schema: anyOfSchema,
    data: getExample(anyOfSchema),
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
