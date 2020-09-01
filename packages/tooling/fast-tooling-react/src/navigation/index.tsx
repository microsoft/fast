import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import ModularNavigation from "./navigation";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const Navigation: React.FC<any> = (
    props: React.PropsWithChildren<any>
): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ModularNavigation {...props} />
        </DndProvider>
    );
};

export { ModularNavigation, Navigation };
export * from "./navigation.props";
