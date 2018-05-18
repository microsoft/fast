import * as React from "react";

export interface ICategoryDocumentationProps {
    slot: string;
}

class CategoryDocumentation extends React.Component<ICategoryDocumentationProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default CategoryDocumentation;
