import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import * as generalExampleSchema from "./general-example";
import config from "./general-example.config";

const name: string = "general-example";

const exampleData: IFormProps = {
    schema: generalExampleSchema,
    data: getExample(generalExampleSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
    componentMappingToPropertyNames: config
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
