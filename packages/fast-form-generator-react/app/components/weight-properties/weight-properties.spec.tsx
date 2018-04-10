import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import { weightPropertiesWeight, weightPropertiesConfig } from "./weight-properties.config";
import * as weightPropertiesSchema from "./weight-properties.schema.json";

const name: string = "weight-properties";

const exampleData: IFormProps = {
    schema: weightPropertiesSchema,
    data: getExample(weightPropertiesSchema),
    onChange: (data: any): void => {},
    orderByPropertyNames: weightPropertiesWeight,
    componentMappingToPropertyNames: weightPropertiesConfig
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
