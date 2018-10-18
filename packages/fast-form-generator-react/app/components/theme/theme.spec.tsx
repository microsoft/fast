import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormProps } from "../../../src/form";
import config from "./theme.config";
import * as themeSchema from "./theme.schema.json";

const name: string = "theme";

const exampleData: FormProps = {
    schema: themeSchema,
    data: getExample(themeSchema),
    /* tslint:disable-next-line */
    onChange: (data: any): void => {},
    componentMappingToPropertyNames: config
};

const examples: SnapshotTestSuite<FormProps> = {
    name,
    component: Form,
    data: [exampleData]
};

describe(name, () => {
    generateSnapshots(examples);
});
