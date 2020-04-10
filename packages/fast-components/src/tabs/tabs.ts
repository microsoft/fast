import { attr, FastElement, observable } from "@microsoft/fast-element";

export enum TabsOrientation {
    vertical = "vertical",
    horizontal = "horizontal",
}

export class Tabs extends FastElement {
    @attr
    public orientation: TabsOrientation = TabsOrientation.horizontal;
    private orientationChanged(): void {
        this.orientation === TabsOrientation.vertical
            ? this.classList.add("vertical")
            : this.classList.remove("vertical");
    }

    @observable
    tabs: Node[];
    @observable
    tabPanels: Node[];

    @observable
    activeTab: string | null = "tab-0";

    connectedCallback() {
        super.connectedCallback();
        // console.log(this.tabs);
        this.getTabs();
        this.getTabPanels();
    }

    private getTabs = (): void => {
        this.tabs.forEach((element, index: number) => {
            const tb = element as Element;
            if (tb.slot === "tab") {
                tb.setAttribute(
                    "aria-selected",
                    this.activeTab === `tab-${index}` ? "true" : "false"
                );
                tb.setAttribute("aria-controls", `panel-${index}`);
                tb.setAttribute("id", `tab-${index}`);
                tb.addEventListener("mousedown", this.handleTabClick);

                console.log("All Tabs", tb);
            }
        });
    };

    private validTabPanels(element) {
        return element.nodeType === 1 && element.getAttribute("role") === "tabpanel";
    }

    private getTabPanels = (): void => {
        const tp = this.tabPanels.filter(this.validTabPanels);
        tp.forEach((element, index: number) => {
            const tabpanels = element as Element;
            tabpanels.setAttribute("tabindex", "0");
            tabpanels.setAttribute("aria-labeledby", `tab-${index}`);
            tabpanels.removeAttribute("hidden");
            this.activeTab !== `tab-${index}`
                ? tabpanels.setAttribute("hidden", "")
                : void tabpanels.setAttribute("id", `panel-${index}`);
            console.log("All Tab panels", tabpanels);
        });
    };

    private handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.srcElement as Element;
        if (selectedTab.nodeType === 1) {
            this.activeTab = selectedTab.getAttribute("id");
            this.getTabs();
            this.getTabPanels();
            console.log(this.activeTab);
        }
    };

    // private getTabs() {
    //     this.tabItems.filter(item => {
    //         const tabs = item.childNodes;
    //         //console.log("Slots", item.childNodes)
    //         tabs.forEach(element => {
    //             const tb = element as Element;
    //             if (tb.slot === "tab") {
    //                 console.log("All Tabs", tb);
    //                 return tb;
    //             }
    //         });
    //     });
    // }
}
