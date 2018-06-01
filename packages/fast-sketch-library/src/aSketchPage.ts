import { Base, nodeToSketchLayers, Page, SymbolMaster, Text,  } from "@brainly/html-sketchapp";
import { ISymbolLibrarySource } from "./sketch-library";
const symbolNameDataAttribute: string = "data-sketch-symbol";

export function getAsketchSymbols(source: ISymbolLibrarySource): JSON[] {
    const selectors: string = Array.isArray(source.selectors) ? source.selectors.join(", ") : source.selectors;
    const nodes: Element[] = Array.from(document.querySelectorAll(selectors));

    return nodes.map((node: Element) => {
        const rect: ClientRect = node.getBoundingClientRect();
        const x: number = rect.left;
        const y: number = rect.top;
        const height: number = rect.height;
        const width: number = rect.width;
        const symbol: SymbolMaster = new SymbolMaster({ x, y, width, height });
        const children: Element[] = Array.from(node.querySelectorAll("*"));
        const allNodes: Element[] = [node].concat(children);

        if (node.hasAttribute(symbolNameDataAttribute)) {
            symbol.setName(node.getAttribute(symbolNameDataAttribute));
        } else {
            symbol.setName("Symbol");
        }

        allNodes
            .filter((filtered: Element) => filtered !== null || undefined)
            .map(convertNodeToSketchLayers)
            .reduce((accumulator: any[], value: any[]) => accumulator.concat(value), [])
            .filter((value: any) => value !== null)
            .forEach((layer: any): void => {
                symbol.addLayer(layer);
            });
        return symbol;
    }).map((symbol: SymbolMaster) => symbol.toJSON());
}

function convertNodeToSketchLayers(node: Element): any[] {
    const layers: Base[] = nodeToSketchLayers(node);

    return layers.map((layer: Base) => {
        if (!(layer instanceof Text) && node.classList && node.classList.length) {
            const classes: string = Array.from(node.classList).join(" ");

            // Trim unique class ids created by JSS
            const trimmed: string = classes.replace(/[-0-9]+/g, "");
            layer.setName(trimmed.replace(/[^A-Za-z0-9_]/g, " "));
        }

        return layer;
    });
}
