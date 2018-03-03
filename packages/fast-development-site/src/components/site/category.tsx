import * as React from "react";
import {Link} from "react-router-dom";
import {ISiteCategoryProps, ISiteCategoryItemProps} from "./";

interface ICategoryProps {
    category: ISiteCategoryProps;
}

class Category extends React.Component<ICategoryProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <h1>{this.props.category.name}</h1>
                <ul>
                    {this.renderCategoryLinks()}
                </ul>
            </div>
        );
    }

    private renderCategoryLinks(): JSX.Element[] {
        return this.props.category.items.map((item: ISiteCategoryItemProps, index: number) => {
            return (
                <li key={index}>
                    <Link to={`/${this.props.category.name}/${item.name}`}>
                        {item.name}
                    </Link>
                </li>
            );
        });
    }
}

export default Category;
