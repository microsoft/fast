import { FASTElement } from "@microsoft/fast-element";
import { html } from "@microsoft/fast-element/html.js";
import { repeat } from "@microsoft/fast-element/repeat.js";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i}`);

export class BenchElement extends FASTElement {
    items = items;
}

export const template = html<BenchElement>`
    <ul>
        ${repeat(
            x => x.items,
            html<string>`
                <li>${x => x}</li>
            `,
        )}
    </ul>
`;
