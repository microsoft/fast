import * as React from "react";
import { Link } from "react-router-dom";

export interface ISiteCategoryIconProps {
    slot?: string;
}

class SiteCategoryIcon extends React.Component<ISiteCategoryIconProps, {}> {
    public render(): JSX.Element {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}

export default SiteCategoryIcon;
