import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { viewportPositionerSchema } from "../index";
import ViewportPositioner, {
    ViewportPositionerHandledProps,
    ViewportPositionerManagedClasses,
} from "./viewport-positioner";
import Documentation from "./.tmp/documentation";

const managedClasses: ViewportPositionerManagedClasses = {
    managedClasses: {
        viewportPositioner: "viewportPositioner",
        viewportPositioner__left: "viewportPositioner__left",
        viewportPositioner__right: "viewportPositioner__right",
        viewportPositioner__top: "viewportPositioner__top",
        viewportPositioner__bottom: "viewportPositioner__bottom",
        viewportPositioner__horizontalInset: "viewportPositioner__horizontalInset",
        viewportPositioner__verticalInset: "viewportPositioner__verticalInset",
    },
};

const examples: ComponentFactoryExample<ViewportPositionerHandledProps> = {
    name: "Viewport positioner",
    component: ViewportPositioner,
    schema: viewportPositionerSchema as any,
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
