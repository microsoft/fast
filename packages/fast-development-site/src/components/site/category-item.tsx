import * as React from "react";

export interface ICategoryItemProps {
    name: string;
    component: any;
    type?: string;
    data: any;
}

class CategoryItem extends React.Component<ICategoryItemProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <h1>{this.props.name}</h1>
                {this.renderComponent()}
            </div>
        );
    }

    private renderComponent(): JSX.Element[] {
        if (this.props.data) {
            return this.props.data.map((data: any, index: number) => {
                if (this.props.type === "polymer") {
                    return (
                        <this.props.component.is key={index} {...data}>
                            {...data.children}
                        </this.props.component.is>
                    );
                } else {
                    return (
                        <this.props.component key={index} {...data} />
                    );
                }
            });
        }
    }
}

export default CategoryItem;
