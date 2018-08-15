import * as React from "react";
import componentDetailExampleFactory from "./component-detail-example-factory";
import componentExampleFactory from "./component-example-factory";
import componentDocumentationFactory from "./component-documentation-factory";
import { SiteCategory, SiteSlot } from "../";

/**
 * An interface to describe the data required to generate a component example using the componentFactory function
 * @param T - the prop interface for the example component
 */
export interface IComponentFactoryExample<T> {
    /**
     * The name of the component example
     */
    name: string;

    /**
     * The JSON schema for a component
     */
    schema: any;

    /**
     * The React component to apply example props from
     */
    component: React.ComponentType<T>;

    /**
     * The example data to use for the component detail section
     */
    detailData: T;

    /**
     * The example data to use for all component examples
     */
    data: T[];

    /**
     * The React component to serve as documentation for the component
     */
    documentation: JSX.Element;
}

/**
 * An interface to describe the examples object consumed by componentFactor
 */
export interface IComponentFactorExamples {
    [key: string]: IComponentFactoryExample<any>;
}

export default function componentFactory<P, T>(examples: IComponentFactorExamples, designSystem?: T): JSX.Element[] {
    return Object.keys(examples).map((exampleKey: string, index: number) => {
        const example: IComponentFactoryExample<P> = examples[exampleKey];
        return (
            <SiteCategory
                key={index}
                slot={SiteSlot.category}
                name={example.name}
                schema={example.schema}
                component={example.component}
            >
                {componentDetailExampleFactory<T>(example.detailData, designSystem)}
                {componentExampleFactory<T>(examples, exampleKey, designSystem)}
                {componentDocumentationFactory(example.documentation)}
            </SiteCategory>
        );
    });
}
