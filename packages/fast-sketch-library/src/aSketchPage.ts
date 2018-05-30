import { Page, nodeToSketchLayers, SymbolMaster } from "@brainly/html-sketchapp";

/**
 * Get aSketch page data from a source object
 */
export function getAsketchPage(source): JSON {
    const nodes = Array.from(document.querySelectorAll(source.selectors));
    const page = new Page({
        width: 1200,
        height: 1200
    });

    // TODO where can we get this name from?
    page.setName("Example page");

    nodes.map((node: Element) => {
        const { left: x, top: y, width, height } = node.getBoundingClientRect();
        const symbol = new SymbolMaster({ x, y, width, height });
        console.log(symbol);
        const children = Array.from(node.querySelectorAll("*"));
        symbol.setName("Example symbol")

        const thing = [node].concat(children);
        thing
            .filter((filtered: Element) => filtered !== null || undefined)
            .map(convertNodeToSketchLayers)
            .reduce((accumulator: any[], value: any[]) => accumulator.concat(value), [])
            .filter((value: any) => value !== null)
            .forEach((layer: any): void => {
                symbol.addLayer(layer);
            });

        // TODO where can we get this name from?

        return symbol;
    }).forEach((symbol: any) => {
        page.addLayer(symbol);
    });

    return page.toJSON();
}

function convertNodeToSketchLayers(node: Element): any[] {
    const layers = nodeToSketchLayers(node);

    return layers.map((layer: any) => {
        layer.setName("New layer");
        return layer;
    });
}
