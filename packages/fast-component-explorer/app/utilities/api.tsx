import React from "react";
import { Progress } from "@microsoft/fast-components-react-msft";

export default function API(
    Component: ReturnType<typeof React.lazy>
): React.ComponentClass<{}, {}> {
    return class APIRenderer extends React.Component<{}, {}> {
        public render(): JSX.Element {
            return (
                <React.Suspense
                    fallback={
                        <Progress circular={true} style={{ margin: "24px auto 0" }} />
                    }
                >
                    <Component />
                </React.Suspense>
            );
        }
    };
}
