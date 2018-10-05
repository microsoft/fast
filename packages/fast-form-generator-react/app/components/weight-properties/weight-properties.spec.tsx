import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import { weightPropertiesConfig, weightPropertiesWeight } from "./weight-properties.config";
import * as weightPropertiesSchema from "./weight-properties.schema.json";

const name: string = "weight-properties";

const exampleData: FormProps = {
    schema: weightPropertiesSchema,
    data: getExample(weightPropertiesSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
    orderByPropertyNames: weightPropertiesWeight,
    componentMappingToPropertyNames: weightPropertiesConfig
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
