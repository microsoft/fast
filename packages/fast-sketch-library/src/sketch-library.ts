import * as puppeteer from "puppeteer";
import { Browser, Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

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
 * Extracts sketch symbol library from a given config
 */
export async function extractSymbols(sources: ISymbolLibrarySource | ISymbolLibrarySource[]): Promise<string[]> {
    const standardizedSources: ISymbolLibrarySource[] = Array.isArray(sources) ? sources : [sources];
    const browser: Browser = await puppeteer.launch();

    // Standardize the input
    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    return new Promise<string[]>((resolve, reject) => {
        const sourcesPromises = standardizedSources.map((source: ISymbolLibrarySource) => {
            return getSymbolsFromSource(source, browser);
        });

        Promise.all(sourcesPromises)
            .then((values: string[]) => {
                resolve(values);
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
}

/**
 * Extract symbol data from a single source
 */
async function getSymbolsFromSource(source: ISymbolLibrarySource, browser: Browser): Promise<string> {
    const page: Page = await browser.newPage();

    page.on("console", (message: any) => {
        // console.log(message);
        // if (Array.isArray(message._args)) {
        //     message._args.forEach((arg: string) => {
        //         console.log(arg);
        //     });
        // }
    });

    await page.setViewport({
        width: 1680,
        height: 930
    });

    await page.goto(source.url, {
        waitUntil: "domcontentloaded"
    });

    await page.addScriptTag({
        content: aSketchPage
    });

    const argument = JSON.stringify(source);
    const aSketchJson = await page.evaluate(`sketchLibrary.getAsketchPage(${argument})`, source);

    return new Promise<string>((resolve, reject) => {
        browser.close();
        resolve(JSON.stringify(aSketchJson));
    });
}

// /**
//  * Get aSketch page data from a source object
//  */
// function getAsketchPage(source): () => JSON {
//     const nodes = Array.from(document.querySelectorAll(source.selectors));
//     const page = new SketchPage({
//         width: 1200,
//         height: 1200
//     });
// 
//     // TODO where can we get this name from?
//     page.setName("Example page");
// 
//     nodes.map((node: Element) => {
//         const { left: x, top: y, width, height } = node.getBoundingClientRect();
//         const symbol = new SymbolMaster({ x, y, width, height });
//         const children = Array.from(node.querySelectorAll("*"));
// 
//         [node].concat(children)
//             .filter((filtered: Element) => Boolean(filtered))
//             .map(convertNodeToSketchLayers)
//             .forEach((layer: any): void => {
//                 symbol.addLayer(layer);
//             });
// 
//         // TODO where can we get this name from?
//         symbol.setName("Example symbol")
// 
//         return symbol;
//     }).forEach((symbol: any) => {
//         page.addLayer(symbol);
//     });
// 
//     return page.toJSON();
// }
// 
// function convertNodeToSketchLayers(node: Element): any {
//     const layers = nodeToSketchLayers(node);
// 
//     return layers.map((layer: any) => {
//         layer.setName("New layer");
//     });
// }
