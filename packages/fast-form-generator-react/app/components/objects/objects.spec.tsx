import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as objectsSchema from "./objects.schema.json";

const name: string = "objects";

const exampleData: IFormProps = {
    schema: objectsSchema,
    data: getExample(objectsSchema),
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
