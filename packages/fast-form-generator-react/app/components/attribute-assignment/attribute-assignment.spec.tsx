import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import config from "./attribute-assignment.config";
import * as attributeAssignmentSchema from "./attribute-assignment.schema.json";

const name: string = "attribute-assignment";

const exampleData: IFormProps = {
    schema: attributeAssignmentSchema,
    data: getExample(attributeAssignmentSchema),
    onChange: (data: any): void => {},
    attributeSettingsMappingToPropertyNames: config
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
