import * as React from "react";
import { Link } from "react-router-dom";
import { ISiteCategoryItemProps } from "./category-item";
import { ISiteCategoryProps } from "./category";
import { ISiteProps } from "./";

class SiteCategoryList extends React.Component<ISiteProps, {}> {

    public render(): JSX.Element {
        return (
            <nav>
                <ul>
                    {this.renderCategoryLinks()}
                </ul>
            </nav>
        );
    }

    private renderCategoryLinks(): JSX.Element[] {
        return [];
    }
}

export default SiteCategoryList;
