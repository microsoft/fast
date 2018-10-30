import * as React from "react";

export interface SiteTitleProps {
    slot?: string;
}

class SiteTitle extends React.Component<SiteTitleProps, {}> {
    public render(): JSX.Element {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}

export default SiteTitle;
