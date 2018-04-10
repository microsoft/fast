import * as React from "react";
import { Link } from "react-router-dom";

export interface ISiteCategoryProps {
    slot: string;
    name: string;
}

class SiteCategory extends React.Component<ISiteCategoryProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default SiteCategory;
