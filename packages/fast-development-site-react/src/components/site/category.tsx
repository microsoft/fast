import * as React from "react";
import { Link } from "react-router-dom";
import { ICategoryItemProps } from "./category-item";

export interface ICategoryProps {
    name: string;
    items: ICategoryItemProps[];
}

class Category extends React.Component<ICategoryProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <h1>{this.props.name}</h1>
                <ul>
                    {this.renderCategoryLinks()}
                </ul>
            </div>
        );
    }

    private renderCategoryLinks(): JSX.Element[] {
        return this.props.items.map((item: ICategoryItemProps, index: number) => {
            return (
                <li key={index}>
                    <Link to={`/${this.props.name}/${item.name}`}>
                        {item.name}
                    </Link>
                </li>
            );
        });
    }
}

export default Category;
