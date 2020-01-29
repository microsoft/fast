import { ChildOptionItem } from "../../../";
import Example from "./example";
import exampleSchema from "./example.schema.json";

const componentOptions: ChildOptionItem[] = [
    {
        schema: exampleSchema,
        component: Example,
    },
];

export default componentOptions;
