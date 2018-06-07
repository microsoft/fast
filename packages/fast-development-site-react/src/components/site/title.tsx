import * as React from "react";

export interface ISiteTitleProps {
    slot?: string;
}

class SiteTitle extends React.Component<ISiteTitleProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default SiteTitle;
