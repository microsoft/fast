import * as React from "react";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import Site, {
    componentFactory,
    formChildFromExamplesFactory,
    IFormChildOption,
    ISiteProps,
    SiteCategory,
    SiteCategoryIcon,
    SiteCategoryItem
} from "@microsoft/fast-development-site-react";
import * as examples from "./examples";

const formChildOptions: IFormChildOption[] = formChildFromExamplesFactory(examples);

export enum Direction {
    rtl = "rtl",
    ltr = "ltr"
}

export default class App extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return (
            <Site
                title={"FAST Microsoft component documentation"}
                formChildOptions={formChildOptions}
                onUpdateLTR={this.handleUpdateLTR}
            >
                <SiteCategory slot={"category"} name={"Building blocks"}>
                    <SiteCategoryIcon slot="category-icon">
                        <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                    </SiteCategoryIcon>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Components"}>
                    {componentFactory(examples, DesignSystemDefaults)}
                </SiteCategory>
            </Site>
        );
    }

    private handleUpdateLTR = (direction: Direction): void => {
        // TODO: #486 change the design system direction (ltr)
    }
}
