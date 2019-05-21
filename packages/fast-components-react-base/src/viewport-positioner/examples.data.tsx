import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./viewport-positioner.schema.json";
import ViewportPositioner, {
    ViewportPositionerHandledProps,
    ViewportPositionerManagedClasses,
} from "./viewport-positioner";
import Documentation from "./.tmp/documentation";

const managedClasses: ViewportPositionerManagedClasses = {
    managedClasses: {
        viewportPositioner: "viewportPositioner",
        viewportPositioner__left: "viewportPositioner__left",
        viewportPositioner__centerLeft: "viewportPositioner__centerLeft",
        viewportPositioner__right: "viewportPositioner__right",
        viewportPositioner__centerRight: "viewportPositioner__centerRight",
        viewportPositioner__top: "viewportPositioner__top",
        viewportPositioner__middleTop: "viewportPositioner__middleTop",
        viewportPositioner__bottom: "viewportPositioner__bottom",
    },
};

const examples: ComponentFactoryExample<ViewportPositionerHandledProps> = {
    name: "Viewport positioner",
    component: ViewportPositioner,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: "Viewport positioner",
    },
    data: [
        {
            ...managedClasses,
            children: "Viewport positioner",
        },
    ],
};

export default examples;
