import { IFormChildOption } from "../components/";

export interface IExample {
    name: string;
    component: any;
    schema: JSON;
    data: any[]
}

export default function componentFactory(examples: IExample): IFormChildOption[] {
    const formChildOptions: IFormChildOption[] = [];

    Object.keys(examples).forEach((exampleKey: string) => {
        formChildOptions.push({
            name: examples[exampleKey].name,
            component: examples[exampleKey].component,
            schema: examples[exampleKey].schema
        });
    });

    return formChildOptions;
}
