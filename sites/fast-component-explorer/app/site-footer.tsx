import { FooterTemplate } from "@microsoft/fast-website";
import "@microsoft/fast-website/src/app/css/footer.css";
import "@microsoft/fast-website/src/app/css/logo.css";
import "@microsoft/fast-website/src/app/css/root.css";
import "@microsoft/fast-website/src/app/css/site-wrapper.css";
import React from "react";

export { SiteNavigation } from "@microsoft/fast-website";

export class Footer extends React.Component<{}, {}> {
    render(): React.ReactNode {
        return (
            <div className={"footer-region"}>
                <div
                    className={"site-wrapper"}
                    dangerouslySetInnerHTML={{ __html: FooterTemplate() }}
                ></div>
            </div>
        );
    }
}
