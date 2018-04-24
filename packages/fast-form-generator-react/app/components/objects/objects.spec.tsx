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
    /* tslint:disable-next-line */
    onChange: (data: any): void => {}
};

const examples: ISnapshotTestSuite<IFormProps> = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
