export { FASTAnchor, FooterTemplate, SiteNavigation } from "@microsoft/fast-website";
import "@microsoft/fast-website/src/app/css/footer.css";
import "@microsoft/fast-website/src/app/css/logo.css";
import "@microsoft/fast-website/src/app/css/root.css";
import "@microsoft/fast-website/src/app/css/site-wrapper.css";
import React from "react";

export class Footer extends React.Component<{}, {}> {
    render(): React.ReactNode {
        return (
            <fast-design-system-provider
                class="site-wrapper"
                use-defaults
                dangerouslySetInnerHTML={{ __html: FooterTemplate() }}
            ></fast-design-system-provider>
        );
    }
}
