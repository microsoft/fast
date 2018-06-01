import * as puppeteer from "puppeteer";
import { Browser, Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { Page as SketchPage, Group } from "@brainly/html-sketchapp";

/**
 * Store in-page script content as a string to be loaded into the browser
 */
const aSketchPage = fs.readFileSync(path.resolve(__dirname, "./aSketchPage.js")).toString();

export interface ISymbolLibrarySource {
    /**
     * The URL of a symbol source
     */
    url: string;

    /**
     * Selectors for which to extract symbols from
     */
    selectors: string | string[];
}

/**
 * Ensure our source object structure is consistent
 */
function normalizeSources(sources: ISymbolLibrarySource | ISymbolLibrarySource[]): ISymbolLibrarySource[] {
    return Array.isArray(sources) ? sources : [sources];
}

/**
 * Extracts sketch symbol library given a config
 */
export async function extractSymbols(sources: ISymbolLibrarySource | ISymbolLibrarySource[]): Promise<string> {
    const standardizedSources: ISymbolLibrarySource[] = normalizeSources(sources);
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    let symbols = [];

    await page.setViewport({
        width: 1680,
        height: 930
    });

    page.on("console", (message: any) => {
        // Uncomment the following line for debugging
        // console.log(message);
    });

    for (const source of standardizedSources) {
        symbols = symbols.concat(await getSymbolsFromSource(source, page));
    }

    symbols = positionSymbols(symbols);

    return new Promise<string>((resolve, reject) => {
        const sketchPage = new SketchPage({
            width: 1200,
            height: 12000
        });

        const flattenedLayers = symbols.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

        // It should be noted that this is not actually JSON
        const sketchPageJson: any = sketchPage.toJSON();

        sketchPageJson.layers = flattenedLayers;
        browser.close();
        resolve(JSON.stringify(sketchPageJson));
    });
}

/**
 * Extract symbol data from a single source
 */
async function getSymbolsFromSource(source: ISymbolLibrarySource, page: Page): Promise<string[]> {
    // Navigate to the source URL
    await page.goto(source.url, {
        waitUntil: "domcontentloaded"
    });

    // Load the script into the browser that will allow generating sketch symbols
    await page.addScriptTag({
        content: aSketchPage
    });

    const symbols = await page.evaluate(`sketchLibrary.getAsketchSymbols(${JSON.stringify(source)})`);

    return new Promise<string[]>((resolve, reject) => {
        resolve(symbols);
    });
}

/**
 * Positions symbols so they don't overlap.
 */
function positionSymbols(symbols: any): any {
    let x = 0;
    let y = 0;
    let rowHeight = 0;
    let pageWidth = 1200;
    const verticalGutter = 28;
    const horizontalGutter = 28;

    return symbols.map(symbol => {
        const { width, height } = symbol.frame;

        // If it can fit on the current row
        if (width <= pageWidth - x) {
            symbol.frame.x = x;
            symbol.frame.y = y;

            x = x + width + horizontalGutter;

            if (height > rowHeight) {
                rowHeight = height;
            }
        } else {
            x = width + horizontalGutter;
            y = y + rowHeight + verticalGutter;
            rowHeight = height;
            symbol.frame.x = 0;
            symbol.frame.y = y;
        }

        return symbol;
    });
}
