import * as React from "react";
import Navigation from "../src";
import childrenSchema from "./configs/children.schema.json";
import { childOptions, children } from "./configs/example.data";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <div
                style={{
                    fontFamily:
                        "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
            >
                <Navigation
                    data={children}
                    schema={childrenSchema}
                    childOptions={childOptions}
                />
            </div>
        );
    }
}

export default App;
