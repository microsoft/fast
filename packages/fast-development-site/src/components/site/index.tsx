import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import {Switch, Route} from "react-router-dom";
import CategoryList from "./category-list";
import Category, {ICategoryProps} from "./category";
import CategoryItem, {ICategoryItemProps} from "./category-item";
import NotFound from "./not-found";

interface ISiteProps {
    categories: ICategoryProps[];
}

class Site extends React.Component<ISiteProps, {}> {

    public render(): JSX.Element {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/">
                        <CategoryList {...this.props} />
                    </Route>
                    {this.renderCategoryRoutes()}
                    {this.renderCategoryItemRoutes()}
                    <Route path="*" component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }

    private renderCategoryRoutes(): JSX.Element[] {
        return this.props.categories.map((category: ICategoryProps, itemIndex: number): JSX.Element => {
            return (
                <Route key={itemIndex} exact={true} path={`/${category.name}`}>
                    <Category {...category} />
                </Route>
            );
        });
    }

    private renderCategoryItemRoutes(): JSX.Element[][] {
        return this.props.categories.map((category: ICategoryProps): JSX.Element[] => {
            return category.items.map((categoryItem: ICategoryItemProps, itemIndex: number): JSX.Element => {
                return (
                    <Route
                        key={itemIndex}
                        exact={true}
                        path={`/${category.name}/${categoryItem.name}`}
                    >
                        <CategoryItem {...categoryItem} />
                    </Route>
                );
            });
        });
    }
}

export default Site;
export {ISiteProps, ICategoryProps};
