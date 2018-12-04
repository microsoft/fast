import * as React from "react";

export type RenderPropChildren = () => React.ReactNode;

export interface CallbackProps {
    renderPropChildren: RenderPropChildren;
}

/**
 * This test components API should have:
 * - no properties but should pass children
 */
export default class Callback extends React.Component<CallbackProps, {}> {
    public static displayName: string = "Callback";

    public render(): JSX.Element {
        return <span>{this.props.renderPropChildren}</span>;
    }
}
