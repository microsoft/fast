import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import * as objectsSchema from "./objects.schema.json";
import { noop } from "lodash-es";

const name: string = "objects";

const exampleData: FormProps = {
    schema: objectsSchema,
    data: getExample(objectsSchema),
    onChange: noop
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [exampleData]
};

describe(name, () => {
    generateSnapshots(examples);
});
