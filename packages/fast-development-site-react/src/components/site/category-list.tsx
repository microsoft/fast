import React from "react";
import { Link } from "react-router-dom";
import { SiteCategoryItemProps } from "./category-item";
import { SiteCategoryProps } from "./category";
import { SiteProps } from "./";

class SiteCategoryList extends React.Component<SiteProps, {}> {
    public render(): JSX.Element {
        return (
            <nav>
                <ul>{this.renderCategoryLinks()}</ul>
            </nav>
        );
    }

    private renderCategoryLinks(): JSX.Element[] {
        return [];
    }
}

export default SiteCategoryList;
