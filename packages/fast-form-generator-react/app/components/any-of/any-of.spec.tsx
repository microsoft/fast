import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import * as anyOfSchema from "./any-of.schema.json";

const name: string = "any-of";

const exampleData: FormProps = {
    schema: anyOfSchema,
    data: getExample(anyOfSchema),
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
