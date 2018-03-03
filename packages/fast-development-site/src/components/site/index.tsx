import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import {Switch, Route} from "react-router-dom";
import CategoryList from "./category-list";
import Category from "./category";
import CategoryItem from "./category-item";
import NotFound from "./not-found";

interface ISiteCategoryItemProps {
    name: string;
    component: any;
    type?: string;
    data: any;
}

interface ISiteCategoryProps {
    name: string;
    items: ISiteCategoryItemProps[];
}

interface ISiteProps {
    categories: ISiteCategoryProps[];
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
        return this.props.categories.map((category: ISiteCategoryProps, itemIndex: number): JSX.Element => {
            return (
                <Route key={itemIndex} exact={true} path={`/${category.name}`}>
                    <Category category={category} />
                </Route>
            );
        });
    }

    private renderCategoryItemRoutes(): JSX.Element[][] {
        return this.props.categories.map((category: ISiteCategoryProps): JSX.Element[] => {
            return category.items.map((categoryItem: ISiteCategoryItemProps, itemIndex: number): JSX.Element => {
                return (
                    <Route
                        key={itemIndex}
                        exact={true}
                        path={`/${category.name}/${categoryItem.name}`}
                    >
                        <CategoryItem item={categoryItem} />
                    </Route>
                );
            });
        });
    }
}

export default Site;
export {ISiteProps, ISiteCategoryProps, ISiteCategoryItemProps};
