import { FormChildOption } from "../components/";

export interface Example {
    name: string;
    component: any;
    schema: any;
    data: any[];
}

export default function formChildFromExamplesFactory(examples: {
    [key: string]: Example;
}): FormChildOption[] {
    return Object.keys(examples).map((key: string) => {
        return {
            name: examples[key].name,
            component: examples[key].component,
            schema: examples[key].schema,
        };
    });
}
