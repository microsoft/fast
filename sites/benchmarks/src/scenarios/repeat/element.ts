import { FASTElement, html, repeat } from "@microsoft/fast-element";

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
