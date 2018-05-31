import { Page, nodeToSketchLayers, SymbolMaster } from "@brainly/html-sketchapp";

export function getAsketchSymbols(source): JSON[] {
    const nodes = Array.from(document.querySelectorAll(source.selectors));
    
    return nodes.map((node: Element) => {
        const { left: x, top: y, width, height } = node.getBoundingClientRect();
        const symbol = new SymbolMaster({ x, y, width, height });
        const children = Array.from(node.querySelectorAll("*"));
        const nodes = [node].concat(children);
        symbol.setName("Example symbol")

        nodes
            .filter((filtered: Element) => filtered !== null || undefined)
            .map(convertNodeToSketchLayers)
            .reduce((accumulator: any[], value: any[]) => accumulator.concat(value), [])
            .filter((value: any) => value !== null)
            .forEach((layer: any): void => {
                symbol.addLayer(layer);
            });

        // TODO where can we get this name from?

        return symbol;
    }).map(symbol => symbol.toJSON());
}

function convertNodeToSketchLayers(node: Element): any[] {
    const layers = nodeToSketchLayers(node);

    return layers.map((layer: any) => {
        layer.setName("New layer");
        return layer;
    });
}
