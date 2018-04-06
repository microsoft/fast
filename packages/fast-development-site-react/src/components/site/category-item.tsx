import * as React from "react";
import manageJss, { ComponentStyles, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface ICategoryItemManagedClasses {
    category_item: string;
    category_item__component: string;
}

const style: ComponentStyles<ICategoryItemManagedClasses, IDevSiteDesignSystem> = {
    category_item: {
        display: "flex",
        flexWrap: "wrap",
        margin: "24px",
        borderTop: "1px solid rgb(226, 226, 226)",
        borderLeft: "1px solid rgb(226, 226, 226)"
    },
    category_item__component: {
        flexGrow: "1",
        flexBasis: "0",
        padding: "12px",
        minWidth: (config: IDevSiteDesignSystem): string => {
            return `${config.categoryItemComponentMinWidth}px`;
        },
        borderBottom: "1px solid rgb(226, 226, 226)",
        borderRight: "1px solid rgb(226, 226, 226)"
    }
};

export interface ICategoryItemProps {
    name: string;
    categoryItemComponentMinWidth?: number;
    type?: string;
    component: any;
    data: any[];
}

class CategoryItem extends React.Component<ICategoryItemProps & IManagedClasses<ICategoryItemManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.category_item}>
                {this.renderComponent()}
            </div>
        );
    }

    private generateStyle(): any {
        if (this.props.categoryItemComponentMinWidth) {
            return {
                style: {
                    minWidth: `${this.props.categoryItemComponentMinWidth}px`
                }
            };
        }
    }

    private renderComponent(): JSX.Element[] {
        if (this.props.data) {
            return this.props.data.map((data: any, index: number) => {
                if (this.props.type === "polymer") {
                    return (
                        <div
                            key={index}
                            className={this.props.managedClasses.category_item__component}
                            {...this.generateStyle()}
                        >
                            <this.props.component.is {...data}>
                                {...data.children}
                            </this.props.component.is>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={index}
                            className={this.props.managedClasses.category_item__component}
                            {...this.generateStyle()}
                        >
                            <this.props.component {...data} />
                        </div>
                    );
                }
            });
        }
    }
}

export default manageJss(style)(CategoryItem);
