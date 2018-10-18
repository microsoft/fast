import * as React from "react";

export interface ReactHTMLElementProps {
    tag?: string;
    slot?: string;
}

/**
 * A stand-in for any arbitrary HTML element that needs to be added for testing purposes
 */
export default class ReactHTMLElement extends React.Component<ReactHTMLElementProps, {}> {
    public static defaultProps: ReactHTMLElementProps = {
        tag: "div",
        slot: undefined
    };

    public render(): JSX.Element {
        return <this.props.tag>{this.props.children}</this.props.tag>;
    }
}
