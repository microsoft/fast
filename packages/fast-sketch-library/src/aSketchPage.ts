import { Page, Text, nodeToSketchLayers, SymbolMaster } from "@brainly/html-sketchapp";
const symbolNameDataAttribute = "data-sketch-symbol";

export function getAsketchSymbols(source): JSON[] {
    const nodes = Array.from(document.querySelectorAll(source.selectors));
    
    return nodes.map((node: Element) => {
        const { left: x, top: y, width, height } = node.getBoundingClientRect();
        const symbol = new SymbolMaster({ x, y, width, height });
        const children = Array.from(node.querySelectorAll("*"));
        const nodes = [node].concat(children);

        if (node.hasAttribute(symbolNameDataAttribute)) {
            symbol.setName(node.getAttribute(symbolNameDataAttribute));
        } else {
            symbol.setName("Symbol")
        }

        nodes
            .filter((filtered: Element) => filtered !== null || undefined)
            .map(convertNodeToSketchLayers)
            .reduce((accumulator: any[], value: any[]) => accumulator.concat(value), [])
            .filter((value: any) => value !== null)
            .forEach((layer: any): void => {
                symbol.addLayer(layer);
            });
        return symbol;
    }).map(symbol => symbol.toJSON());
}

function convertNodeToSketchLayers(node: Element): any[] {
    const layers = nodeToSketchLayers(node);

    return layers.map((layer: any) => {
        if (!(layer instanceof Text) && node.classList && node.classList.length) {
            let classes = Array.from(node.classList).join(" ");

            // Trim unique class ids created by JSS
            let trimmed = classes.replace(/[-0-9]+/, "");
            layer.setName(trimmed.replace(/[^A-Za-z0-9_]/g, " "))
        }

        return layer;
    });
}
