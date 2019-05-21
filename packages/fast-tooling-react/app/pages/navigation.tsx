import React from "react";
import { Navigation } from "../../src";
import childrenSchema from "./navigation/children.schema.json";
import { childOptions, children } from "./navigation/example.data";

class NavigationTestPage extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <Navigation
                data={children}
                schema={childrenSchema}
                childOptions={childOptions}
            />
        );
    }
}

export { NavigationTestPage };
