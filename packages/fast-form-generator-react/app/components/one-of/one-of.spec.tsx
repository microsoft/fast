import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import * as oneOfSchema from "./one-of.schema.json";

const name: string = "one-of";

const exampleData: FormProps = {
    schema: oneOfSchema,
    data: getExample(oneOfSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [exampleData]
};

describe(name, () => {
    generateSnapshots(examples);
});
