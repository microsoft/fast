import * as React from "react";
import {ISiteCategoryItemProps} from "./";

interface ICategoryItemProps {
    item: ISiteCategoryItemProps;
}

class CategoryItem extends React.Component<ICategoryItemProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <h1>{this.props.item.name}</h1>
                {this.renderComponent()}
            </div>
        );
    }

    private renderComponent(): JSX.Element[] {
        return this.props.item.data.map((data: any, index: number) => {
            if (this.props.item.type === "polymer") {
                return (
                    <this.props.item.component.is key={index} {...data}>
                        {...data.children}
                    </this.props.item.component.is>
                );
            } else {
                return (
                    <this.props.item.component key={index} {...data} />
                );
            }
        });
    }
}

export default CategoryItem;
