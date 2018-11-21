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
        slot: undefined,
    };

    public render(): JSX.Element {
        const props: any = Object.assign({}, this.props);

        delete props.tag;
        delete props.slot;
        delete props.children;

        return <this.props.tag {...props}>{this.props.children}</this.props.tag>;
    }
}
