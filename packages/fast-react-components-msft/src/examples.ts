import * as React from "react";

export type IExampleData<T> = T;

export interface IGenericExample<T> {
    name: string;

    component: React.ComponentClass;

    data: Array<IExampleData<T>>;
}
