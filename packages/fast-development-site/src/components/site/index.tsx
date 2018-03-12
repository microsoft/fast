import * as React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import { DesignSystemProvider } from "@microsoft/fast-react-jss-manager";
import devSiteDesignSystemDefaults from "../design-system";

import Shell, { ShellActionBar, ShellCanvas, ShellHeader, ShellPane, ShellRow } from "../shell";
import Breadcrumb, { BreadcrumbItem } from "../breadcrumb";
import CategoryList from "./category-list";
import Category, {ICategoryProps} from "./category";
import CategoryItem, {ICategoryItemProps} from "./category-item";
import NotFound from "./not-found";

interface ISiteProps {
    title: string;
    categories: ICategoryProps[];
}

class Site extends React.Component<ISiteProps, {}> {

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={devSiteDesignSystemDefaults}>
                <BrowserRouter>
                    <Switch>
                        {this.renderShell(0, "/", this.props, CategoryList)}
                        {this.renderCategoryRoutes()}
                        {this.renderCategoryItemRoutes()}
                        <Route path="*" component={NotFound} />
                    </Switch>
                </BrowserRouter>
            </DesignSystemProvider>
        );
    }

    private renderShell(key: number, path: string, element: any, CanvasComponent: any): JSX.Element {
        return (
            <Route key={key} exact={true} path={path}>
                <Shell>
                    <ShellHeader>
                        {this.props.title}
                    </ShellHeader>
                    <ShellActionBar>
                        <Breadcrumb>
                            {this.generateBreadcrumbItems(path)}
                        </Breadcrumb>
                    </ShellActionBar>
                    <ShellRow>
                        <ShellCanvas>
                            <CanvasComponent {...element} />
                        </ShellCanvas>
                    </ShellRow>
                </Shell>
            </Route>
        );
    }

    private renderCategoryRoutes(): JSX.Element[] {
        return this.props.categories.map((category: ICategoryProps, itemIndex: number): JSX.Element => {
            return this.renderShell(itemIndex, `/${category.name}`, category, Category);
        });
    }

    private renderCategoryItemRoutes(): JSX.Element[][] {
        return this.props.categories.map((category: ICategoryProps): JSX.Element[] => {
            return category.items.map((categoryItem: ICategoryItemProps, itemIndex: number): JSX.Element => {
                return this.renderShell(itemIndex, `/${category.name}/${categoryItem.name}`, categoryItem, CategoryItem);
            });
        });
    }

    private generateBreadcrumbItems(path: string): JSX.Element[] {
        const pathItems: string[] = path.split("/").filter((item: string) => {
            return item !== "";
        });

        pathItems.unshift("");

        if (pathItems.length === 0) {
            return null;
        }

        let to: string = "";

        return pathItems.map((item: string, index: number) => {
            to += `${to === "/" ? "" : "/"}${item}`;

            return (
                <BreadcrumbItem
                    key={index}
                    to={index === pathItems.length - 1 ? null : to}
                >
                    {item !== "" ? item.charAt(0).toUpperCase() + item.slice(1, item.length) : "Index"}
                </BreadcrumbItem>
            );
        });
    }
}

export default Site;
export {ISiteProps, ICategoryProps};
