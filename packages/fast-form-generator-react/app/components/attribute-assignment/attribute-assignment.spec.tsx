import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import config from "./attribute-assignment.config";
import * as attributeAssignmentSchema from "./attribute-assignment.schema.json";

const name: string = "attribute-assignment";

const exampleData: FormProps = {
    schema: attributeAssignmentSchema,
    data: getExample(attributeAssignmentSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
    attributeSettingsMappingToPropertyNames: config
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});
