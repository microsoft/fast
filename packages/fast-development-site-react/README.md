# FAST React development site
A boilerplate development site that can be used to show a library of React components. All necessary navigational elements and routing will be generated to provide a full site for the documentation and testing of components.

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
                component={Paragraph},
                status={"Released}
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

### Slots
You will see that a lot of the components require the passing of a property called **slot**. In a similar vein to how web components use slots we have them assigned to our components and they can also be used for arbirary components to place any component into the location indicated by the slot. Using your own components with a **slot** is still in flux so do this at your own risk.

### Site
The `Site` component should be used as the wrapping component for the development site.

**formChildOptions** - The form child options are the optional children that can be added to a component that can have children, as specified in its JSON schema. The options are provided to the implementation the FAST development site makes of the `@microsoft/fast-form-generator-react`, the data structure that is used is from the `Form` property `childOptions` and can be referenced [here](../fast-form-generator-react/README.md).

**onUpdateDirection** - The callback provided for an update in RTL, it will execute the given callback with "rtl" or "ltr".

**onUpdateTheme** - The callback provided for an update for theme, it well execute the given callback with the selected theme.

#### Example callback to be passed to `onUpdateTheme`
```jsx
handleOnUpdateTheme = (theme: string): void {
    this.setState({theme});
}
```
**themes** - An object with properties `id`,`displayName` and `background`. The `background` property will be applied to the container of the component examples on the detail and example pages.

#### Example on usage of `themes`
```jsx
const themes = [
    {id: "Light", displayName: "Light", background: "#FFF"},
    {id: "Dark", displayName: "Dark", background: "#000"},
    {id: "Blue", displayName: "Blue", background: "#0000FF"}];
}
```

**componentBackgroundTransparent** - Adds an initial background transparency to the examples on the component view.

### SiteTitle
The `SiteTitle` is used as a child of `Site` and should contain the title of the application/site which will appear in the header.

**slot** - The `slot` property is required and must pass the string `"title"`.

### SiteTitleBrand
The `SiteTitleBrand` can be used as a child of `SiteTitle` and will bold and color the text contents to the FAST Development Site brand color.

### SiteCategory
The `SiteCategory` is used as a child of `Site` and can contain other `SiteCategory` components to create a nested structure.

**slot** - The `slot` property is required and must pass the string `"category"`.

**status**
If the `SiteCategory` contains `SiteCategoryItem` component(s) it can set the status of these items which can be Alpha, Beta or Release. The default is always set to Beta. As the component becomes more stable or is release ready the status can be updated on ISiteCategory props by setting status "Alpha","Beta" or "Released".

### SiteCategoryItem
The `SiteCategoryItem` is used as a child of `SiteCategory`, 

**slot** - The `slot` property is required, the first `SiteCategoryItem` should pass `"canvas-detail-view-documentation"` and any subsequent `SiteCategoryItem` components must pass `"canvas-detail-view-example"`. The item that has the `"canvas-detail-view-documentation"` will show up on the documentation tab while the `"canvas-detail-view-example"` items will be displayed on the examples tab.

**data** - The data is should map to the properties of the component in the parent `SiteCategory`

**designSystem** - (Optional) If a design system is used from the `@microsoft/fast-jss-manager-react` then you can provide any design system configurations to this property.

### SiteCategoryDocumentation
The `SiteCategoryDocumentation` is used as a child of `SiteCategory` and it's children should contain the documentation for the category, provided that the category contains a component and `SiteCategoryItem` components. This will show up below the `SiteCategoryItem` with the slot of `"canvas-detail-view-documentation"`.

**slot** - The `slot` property is required and must pass the string `"canvas-detail-view-documentation"`.
