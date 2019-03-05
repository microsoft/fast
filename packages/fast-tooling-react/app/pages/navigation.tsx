import React from "react";
import { Navigation } from "../../src";
import childrenSchema from "../configs/children.schema.json";
import { childOptions, children } from "../configs/example.data";

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
