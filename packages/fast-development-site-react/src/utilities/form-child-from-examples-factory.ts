import { IFormChildOption } from "../components/";

export interface IExample {
    name: string;
    component: any;
    schema: JSON;
    data: any[];
}

export interface IExampleObj {
    [key: string]: IExample;
}

export default function formChildFromExamplesFactory(examples: IExampleObj): IFormChildOption[] {
    return Object.keys(examples).map((key: string) => {
        return {
            name: examples[key].name,
            component: examples[key].component,
            schema: examples[key].schema
        };
    });
}
