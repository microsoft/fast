import * as React from "react";
import { Link } from "react-router-dom";
import { ICategoryItemProps } from "./category-item";
import { ICategoryProps } from "./category";
import { ISiteProps } from "./";

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
        return this.props.categories.map((category: ICategoryProps, index: number): JSX.Element => {
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

    private renderCategoryItemLinks(category: ICategoryProps): JSX.Element[] {
        return category.items.map((categoryItem: ICategoryItemProps, index: number): JSX.Element => {
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
