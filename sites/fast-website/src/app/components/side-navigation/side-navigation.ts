import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";

export class SideNavigation extends FASTElement {
    @attr
    public category: string;

    @observable
    public currentSection: string = "hero";

    @observable
    public sectionArray: HTMLElement[] = Array.from(
        document.querySelectorAll("section[id]")
    );

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Github"
    );

    private previousRatio: number = 0;

    public clickHandler = (e, parent: boolean): void => {
        const link = parent
            ? e.target.getAttribute("href")
            : e.target.parentElement.getAttribute("href");

        const selectedSection = document.querySelector(link);

        e.preventDefault();

        if (selectedSection) {
            selectedSection.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    constructor() {
        super();

        if (this.getAttribute("category") === "scroll") {
            let observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        const currentRatio = entry.intersectionRatio;

                        if (entry.isIntersecting) {
                            if (currentRatio > this.previousRatio) {
                                console.log(
                                    entry.isIntersecting,
                                    entry.target.id,
                                    currentRatio
                                );
                                this.currentSection = entry.target.id;
                            }
                            this.previousRatio = currentRatio;
                        }
                    });
                },
                { threshold: [0.4, 0.6] }
            );

            this.sectionArray.forEach(section => {
                observer.observe(section);
            });
        }
    }
}
