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
import { Direction } from "@microsoft/fast-application-utilities";
import * as examples from "./examples";
import Hypertext from "../src/hypertext";

/* tslint:disable-next-line */
const sketchDesignKit = require("./fast-dna-msft-design-kit.sketch");

const formChildOptions: IFormChildOption[] = formChildFromExamplesFactory(examples);

export default class App extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return (
            <Site
                title={"FAST Microsoft component documentation"}
                formChildOptions={formChildOptions}
                onUpdateDirection={this.handleUpdateDirection}
            >
                <SiteCategory slot={"category"} name={"Building blocks"}>
                    <SiteCategoryIcon slot="category-icon">
                        <div dangerouslySetInnerHTML={{__html: glyphBuildingblocks}} />
                    </SiteCategoryIcon>
                </SiteCategory>
                <SiteCategory slot={"category"} name={"Components"}>
                    {componentFactory(examples, DesignSystemDefaults)}
                </SiteCategory>
                <div slot="info-bar">
                    <Hypertext href={sketchDesignKit}>Download design kit - sketch</Hypertext>
                </div>
            </Site>
        );
    }

    private handleUpdateDirection = (direction: Direction): void => {
        // TODO: #486 change the design system direction (ltr)
    }
}
