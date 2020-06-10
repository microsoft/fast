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

    public scrollFunc = (num1: number, num2: number): void => window.scrollTo(num1, num2);

    public clickHandler = (e: Event, parent: boolean): void => {
        const target: HTMLElement = e.target as HTMLElement;

        const link: string = parent
            ? (target.getAttribute("href") as string)
            : (target.parentElement?.getAttribute("href") as string);

        const selectedSection: HTMLElement = document.querySelector(link) as HTMLElement;

        e.preventDefault();

        if (CSS.supports("scroll-behavior: smooth")) {
            selectedSection.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            const startY: number = self.pageYOffset;
            const stopY: number = selectedSection.offsetTop;
            const speed: number = Math.round(stopY / 100);
            const increment: number = Math.round(stopY / 25);
            let stepY: number = stopY > startY ? startY + increment : startY - increment;
            let timer: number = 0;

            if (stopY > startY) {
                for (var i = startY; i < stopY; i += increment) {
                    setTimeout(this.scrollFunc, timer * speed, 0, stepY);
                    stepY += increment;
                    if (stepY > stopY) {
                        stepY = stopY;
                    }
                    timer++;
                }
                return;
            }
            for (var i = startY; i > stopY; i -= increment) {
                console.log(stepY, timer, speed);
                setTimeout(this.scrollFunc, timer * speed, 0, stepY);
                stepY -= increment;
                if (stepY < stopY) {
                    stepY = stopY;
                }
                timer++;
            }
        }
    };

    constructor() {
        super();

        if (this.getAttribute("category") === "scroll") {
            let observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        const areaOnScreen =
                            entry.intersectionRatio * entry.boundingClientRect.height;
                        if (areaOnScreen > 0.5 * window.innerHeight) {
                            this.currentSection = entry.target.id;
                        }
                    });
                },
                { threshold: [0, 0.2, 0.4, 0.6, 0.8] }
            );
            this.sectionArray.forEach(section => {
                observer.observe(section);
            });
        }
    }
}
