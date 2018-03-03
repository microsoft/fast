import * as React from "react";
import {Link} from "react-router-dom";
import {ISiteProps, ISiteCategoryProps, ISiteCategoryItemProps} from "./";

class CategoryList extends React.Component<ISiteProps, {}> {

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
        return this.props.categories.map((category: ISiteCategoryProps, index: number): JSX.Element => {
            return (
                <li key={category.name + index}>
                    <Link to={`/${category.name}`}>
                        {category.name}
                    </Link>
                    <ul>
                        {this.renderCategoryItemLinks(category)}
                    </ul>
                </li>
            );
        });
    }

    private renderCategoryItemLinks(category: ISiteCategoryProps): JSX.Element[] {
        return category.items.map((categoryItem: ISiteCategoryItemProps, index: number): JSX.Element => {
            return (
                <li key={category.name + categoryItem.name + index}>
                    <Link to={`/${category.name}/${categoryItem.name}`}>
                        {categoryItem.name}
                    </Link>
                </li>
            );
        });
    }
}

export default CategoryList;
