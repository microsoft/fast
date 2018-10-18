import * as React from "react";

class SiteMenuItem extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <li>{this.props.children}</li>;
    }
}

export default SiteMenuItem;
