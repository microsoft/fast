# FAST React development site
This is the development site that can be used to create a React site for a library of React components. It will generate the necessary navigational elements and routing to provide a full site for the documentation and testing of components.

## Installation
`npm i --save @microsoft/fast-development-site-react`

## Usage
```
import React from "react";
import ReactDOM from "react-dom";
import Site, { SiteCategory, SiteCategoryItem } from "@microsoft/fast-development-site-react";

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Site
            formChildOptions={formChildOptions}
            onUpdateDirection={this.handleUpdateDirection}
        >
            <SiteTitle slot={"title"}>
                <SiteTitleBrand>FAST</SiteTitleBrand> Documentation
            </SiteTitle>
            <SiteCategory
                slot={"category"}
                name={"Components"}
                schema={ParagraphSchema},
                component={Paragraph}
            >
                <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
                    <div>
                        Hello world
                    </div>
                </SiteCategoryDocumentation>
                <SiteCategoryItem
                    slot={"canvas-detail-view-example"}
                    data={componentDataItem}
                    designSystem={{ltr: this.state.direction}}
                />
                <SiteCategoryItem
                    slot={"canvas-example-view"}
                    data={componentDataItem}
                    designSystem={{ltr: this.state.direction}}
                />
            </SiteCategory>
        </Site>,
        root
    );
}

render();
```

### Site
The `Site` component should be used as the wrapping component for the development site.

**formChildOptions** - The options are provided to the implementation the FAST development site makes of the `@microsoft/fast-form-generator-react`, the data structure that is used is from the `Form` property `childOptions` and can be referenced [here](../fast-form-generator-react/README.md)

**onUpdateDirection** - 

### SiteTitle
The `SiteTitle` is used as a child of `Site` and should contain the title of the application/site which will appear in the header.

**slot** - The `slot` property is required and must pass the string `"title"`.

### SiteTitleBrand
The `SiteTitleBrand` can be used as a child of `SiteTitle` and will bold and color the text contents to the FAST Development Site brand color.

### SiteCategory
The `SiteCategory` is used as a child of `Site` and can contain other `SiteCategory` components to create a nested structure.

**slot** - The `slot` property is required and must pass the string `"category"`.

### SiteCategoryItem
The `SiteCategoryItem` is used as a child of `SiteCategory`, 

**slot** - The `slot` property is required, the first `SiteCategoryItem` should pass `"canvas-detail-view-documentation"` and any subsequent `SiteCategoryItem` components must pass `"canvas-detail-view-example"`.
**data** - The data is should map to the properties of the component in the parent `SiteCategory`
**designSystem** - (Optional) If a design system is used from the `@microsoft/fast-jss-manager-react` then you can provide any design system configurations to this property.

### SiteCategoryDocumentation
The `SiteCategoryDocumentation` is used as a child of `SiteCategory` and it's children should contain the documentation for the category, provided that the category contains a component and `SiteCategoryItem` components. This will show up below the `SiteCategoryItem` with the slot of `"canvas-detail-view-documentation"`.

**slot** - The `slot` property is required and must pass the string `"canvas-detail-view-documentation"`.
