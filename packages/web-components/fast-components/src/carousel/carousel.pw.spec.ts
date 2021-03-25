import type { Carousel as FASTCarouselType, Tab as FASTTabType, TabPanel as FASTTabPanelType } from "@microsoft/fast-foundation";
import type { FASTCarouselTestSlide as FASTCarouselTestSlideType } from "./__test__/"
import { expect } from "chai";
import type { ElementHandle } from "playwright";
import type { FASTDesignSystemProvider } from "../design-system-provider";

type FASTCarousel = HTMLElement & FASTCarouselType;
type FASTTab = HTMLElement & FASTTabType;
type FASTTabPanel = HTMLElement & FASTTabPanelType;
type FASTCarouselTestSlide = HTMLElement & FASTCarouselTestSlideType;

describe("FASTCarousel", function () {
    beforeEach(async function () {
        if(!this.page && !this.browser) {
            this.ship();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.providerHandle = (await this.page.$("#root")) as ElementHandle<FASTDesignSystemProvider>;

        this.setupHandle = await this.page.evaluateHandle(
            ([document, provider]) => {
                const element = document.createElement("fast-carousel") as FASTCarousel;

                for(let i = 1; i <= 6; i++){
                    // create test slide
                    const slide = document.createElement("fast-carousel-test-slide") as FASTCarouselTestSlide;
                    slide.textContent = `Slide ${i}`;
                    
                    if(i % 2 === 0) {
                        slide.setAttribute("even", "true");
                    }

                    // create tab
                    const tab = document.createElement("fast-tab") as FASTTab;
                    
                    // create tab panel
                    const tabPanel = document.createElement("fast-tab-panel") as FASTTabPanel;

                    //append test slide to tab panel
                    tabPanel.appendChild(slide);
                    
                    // append tab and tap panel to carousel
                    element.appendChild(tab)
                    element.appendChild(tabPanel)
                }

                provider.appendChild(element);


            },
            [this.documentHandle, this.providerHandle] as [ 
                ElementHandle<Document>,
                ElementHandle<FASTDesignSystemProvider>
            ]
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    it("should render to the page", async function () {
        const element = await this.page.waitForSelector("fast-carousel");
        expect(element).to.exist;
    })

    it("should show the next tab/slide when right arrow key is pressed", async function() {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        
        const firstTab = await this.page.waitForSelector("#tab-1");
        
        await firstTab.press("ArrowRight");

        expect(await element?.evaluate(node => (node as FASTCarousel).activeTabIndex)).to.equal(1);
        
    })

    it("should show the previous tab/slide when left arrow key is pressed", async function() {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        
        const firstTab = await this.page.waitForSelector("#tab-1");
        
        await firstTab.press("ArrowLeft");

        expect(await element?.evaluate(node => (node as FASTCarousel).activeTabIndex)).to.equal(6 - 1);
        
    })
})