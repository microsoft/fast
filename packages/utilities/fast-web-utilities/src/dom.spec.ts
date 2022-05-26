import chai, { expect } from "chai";
import spies from "chai-spies";
import {
    canUseCssGrid,
    canUseFocusVisible,
    canUseForcedColors,
    getDisplayedNodes,
    isHTMLElement,
    resetDocumentCache,
} from "./dom.js";

chai.use(spies);

describe("isHTMLElement", () => {
    document.body.innerHTML = `
        <div id="element">
            Child
        </div>
    `;

    it("should not throw", () => {
        expect(() => {
            isHTMLElement();
        }).not.to.throw();
    });
    it("should return true if all arguments are HTML elements", () => {
        expect(isHTMLElement(document.getElementById("element"))).to.equal(true);
    });
    it("should return false if all arguments are NOT HTML elements", () => {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        expect(isHTMLElement(document.getElementById("element")!.childNodes)).to.equal(
            false
        );
    });
});

describe("getDisplayedNodes", () => {
    it("should not throw if both arguments are null or undefined", () => {
        expect(() => {
            getDisplayedNodes(null, null);
            getDisplayedNodes(undefined, undefined);
        }).not.to.throw();
    });
});

describe("canUseFocusVisible", () => {
    beforeEach(() => {
        resetDocumentCache();
    });
    it("should not throw", () => {
        expect(() => {
            canUseFocusVisible();
        }).not.to.throw();
    });
    it("should return true if the environment supports focus-visible selectors", () => {
        expect(canUseFocusVisible()).to.equal(true);
    });
    it("should use a nonce if once is present on the page", () => {
        const nonce: string = "foo-nonce";
        const metaEl: HTMLMetaElement = document.createElement("meta");
        metaEl.setAttribute("property", "csp-nonce");
        metaEl.setAttribute("content", nonce);
        document.head.appendChild(metaEl);

        // Run the function and intercept its appendChild call
        const realAppendChild = document.head.appendChild;
        const mockAppendChild = chai.spy(realAppendChild);
        Object.defineProperty(document.head, "appendChild", {
            value: mockAppendChild,
            configurable: true,
        });
        const mutationObserverCallback = (mutationsList: MutationRecord[]): void => {
            expect(mutationsList).to.have.length.greaterThan(0);
            expect(mutationsList[0].addedNodes).to.have.length.greaterThan(0);
            expect(mutationsList[0].addedNodes.item(0)).not.to.equal(undefined);
            expect(
                (mutationsList[0].addedNodes.item(0) as HTMLStyleElement).nonce
            ).to.equal(nonce);
        };
        const mutationObserver = new MutationObserver(mutationObserverCallback);
        mutationObserver.observe(document.head, { childList: true, subtree: true });
        canUseFocusVisible();

        expect(mockAppendChild).to.have.been.called.exactly(1);
        Object.defineProperty(document.head, "appendChild", {
            value: realAppendChild,
            configurable: true,
        });
    });
    it("should cache the result for subsequent calls", () => {
        const realAppendChild = document.head.appendChild;
        const mockAppendChild = chai.spy(realAppendChild);
        Object.defineProperty(document.head, "appendChild", {
            value: mockAppendChild,
            configurable: true,
        });
        canUseFocusVisible();

        expect(mockAppendChild).to.have.been.called.exactly(1);

        canUseFocusVisible();
        expect(mockAppendChild).to.have.been.called.exactly(1);
        Object.defineProperty(document.head, "appendChild", {
            value: realAppendChild,
            configurable: true,
        });
    });
});

describe("canUseCssGrid", () => {
    beforeEach(() => {
        resetDocumentCache();
    });
    it("should not throw", () => {
        expect(() => {
            canUseCssGrid();
        }).not.to.throw();
    });
});

describe("canUseForcedColors", () => {
    beforeEach(() => {
        window.matchMedia = (query: any): any => {
            return {
                matches: true,
                media: query,
            };
        };
    });
    it("should return true if forced color is enabled", () => {
        expect(canUseForcedColors()).to.equal(true);
    });
});

describe("canUseForcedColors", () => {
    beforeEach(() => {
        window.matchMedia = (query: any): any => {
            return {
                matches: false,
                media: query,
            };
        };
    });
    it("should return false if forced color is not enabled", () => {
        expect(canUseForcedColors()).to.equal(false);
    });
});
