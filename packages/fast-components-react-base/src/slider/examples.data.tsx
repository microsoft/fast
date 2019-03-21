import * as React from "react";
import Slider, {
    SliderHandledProps,
    SliderManagedClasses,
    SliderUnhandledProps,
} from "./slider";
import schema from "./slider.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<SliderHandledProps> = {
    name: "Slider",
    component: Slider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            slider: "slider",
        },
    },
    data: [
        {
            managedClasses: {
                slider: "slider",
            },
        },
    ],
};

export default examples;
