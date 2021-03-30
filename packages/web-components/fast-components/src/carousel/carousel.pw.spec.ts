import type { Carousel as FASTCarouselType, Tab as FASTTabType, TabPanel as FASTTabPanelType } from "@microsoft/fast-foundation";
import type { FASTCarouselTestSlide as FASTCarouselTestSlideType } from "./__test__/"
import { expect } from "chai";
import type { ElementHandle } from "playwright";
import type { FASTDesignSystemProvider } from "../design-system-provider";
import type { FASTFlipper } from "../flipper";

type FASTCarousel = HTMLElement & FASTCarouselType;
type FASTTab = HTMLElement & FASTTabType;
type FASTTabPanel = HTMLElement & FASTTabPanelType;
type FASTCarouselTestSlide = HTMLElement & FASTCarouselTestSlideType;

describe("FASTCarousel Tabbed Pattern", function () {
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

        expect(await element?.evaluate(node => node.activeTabIndex)).to.equal(1);
        
    })

    it("should show the previous tab/slide when left arrow key is pressed", async function() {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        
        const firstTab = await this.page.waitForSelector("#tab-1");
        
        await firstTab.press("ArrowLeft");

        expect(await element?.evaluate(node => node.activeTabIndex)).to.equal(6 - 1);
        
    })

    it("should pause the rotation when rotation control is clicked and start the rotation when it is clicked again", async function () {
        const element = (await this.page.waitForSelector(
            "fast-carousel",
        )) as ElementHandle<FASTCarousel>;

        expect(await element?.evaluate(node => node.paused)).to.be.false;
        
        await this.page.click('.rotation-control-container');

        expect(await element?.evaluate(node => node.paused)).to.be.true;
    })

    it("should pause the auto play the first time the rotation control is focused", async function () {
        const element = (await this.page.waitForSelector(
            "fast-carousel",
        )) as ElementHandle<FASTCarousel>;

        expect(await element?.evaluate(node => node.paused)).to.be.false;
        
        await this.page.focus("slot[name='rotation-control'] > *");

        expect(await element?.evaluate(node => node.paused)).to.be.true;
    })

    it("should not allow the flippers to be focused", async function ()  {
        const element = (await this.page.waitForSelector(
            "fast-carousel",
        )) as ElementHandle<FASTCarousel>;
            
        const flipper = await this.page.waitForSelector("fast-flipper");

        await this.page.focus("fast-flipper");

        expect(await this.page.evaluate(element => element.isSameNode(document.activeElement), flipper)).to.be.false;
        expect(await this.page.evaluate(element => element.isSameNode(document.activeElement), element)).to.be.true;
    })
})

describe("FASTCarousel Basic Pattern", function () {
    beforeEach(async function () {
        if(!this.page && !this.browser) {
            this.ship();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.providerHandle = (await this.page.$("#root")) as ElementHandle<FASTDesignSystemProvider>;

        this.setupHandle = await this.page.evaluateHandle(
            ([document, provider]) => {
                const element = document.createElement("fast-carousel") as FASTCarousel;
                element.pattern = "basic";

                for(let i = 1; i <= 6; i++){
                    // create test slide
                    const slide = document.createElement("fast-carousel-test-slide") as FASTCarouselTestSlide;
                    slide.textContent = `Slide ${i}`;
                    
                    if(i % 2 === 0) {
                        slide.setAttribute("even", "true");
                    }

                    //append test slide to carousel
                    element.appendChild(slide);
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

    it("should render to the page as basic pattern", async function () {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        expect(element).to.exist;
        expect(await element?.evaluate(node => node.pattern)).to.equal("basic");
    })

    it("should show the next slide when next flipper is clicked", async function() {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        
        await this.page.click('.next-flipper-container')
        
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(1);
    })

    it("should show the previous slide when previous flipper is clicked", async function() {
        const element = (await this.page.waitForSelector(
            "fast-carousel"
        )) as ElementHandle<FASTCarousel>;
        
        await this.page.click('.previous-flipper-container')
        
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(6 - 1);
    })

    it("should pause the rotation, show the next slide when next flipper is activated with enter and space key", async function () {
        const element = (await this.page.waitForSelector(
            "fast-carousel",
        )) as ElementHandle<FASTCarousel>;

        await this.page.press("fast-flipper[direction='next']", 'Enter');

        expect(await element?.evaluate(node => node.paused)).to.be.true;
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(1);
        
        await this.page.press("fast-flipper[direction='next']", ' ');
        
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(2);
    })

    it("should pause the rotation, show the previous slide when previous flipper is activated with enter and space key", async function () {
        const element = (await this.page.waitForSelector(
            "fast-carousel",
        )) as ElementHandle<FASTCarousel>;

        await this.page.press("fast-flipper[direction='previous']", 'Enter');

        expect(await element?.evaluate(node => node.paused)).to.be.true;
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(6 - 1);
        
        await this.page.press("fast-flipper[direction='previous']", ' ');
        
        expect(await element?.evaluate(node => node.activeSlideIndex)).to.equal(6 - 2);
    })
})