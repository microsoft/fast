import { expect, test } from "@playwright/test";
import type { HydrationRepeatRange } from "./repeat-ranges.js";

test("discovers scoped repeat ranges without changing native or legacy markers", async ({
    page,
}) => {
    await page.goto("/");
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { collectHydrationRepeatRanges, HydrationMarkup, markers_v2 } =
            await import("/main.js");
        return [HydrationMarkup, markers_v2].map(markers => {
            const root = document.createElement("div");
            const start =
                markers === HydrationMarkup ? "fe:r" : "fe-repeat$$start$$0$$fe-repeat";
            const end =
                markers === HydrationMarkup ? "fe:/r" : "fe-repeat$$end$$0$$fe-repeat";
            root.innerHTML = `<!--${start}--><i></i><!--${end}--><!--${start}--><b></b><!--${start}--><!--${end}--><!--${end}--><!--${start}--><!--${end}-->`;
            const location = document.createTextNode("");
            root.append(
                location,
                document.createComment(start),
                document.createElement("u"),
                document.createComment(end),
            );
            const before = root.innerHTML;
            const ranges = collectHydrationRepeatRanges(
                root.childNodes[3],
                location,
                markers,
            );
            return {
                unchanged: root.innerHTML === before,
                ranges: ranges.map((range: HydrationRepeatRange) => ({
                    first: range.start.nodeName,
                    last: range.end.nodeName,
                    empty: range.start === range.end,
                    startMarker: range.startMarker.data === start,
                    endMarker: range.endMarker.data === end,
                })),
                owned: ranges[0].start === root.querySelector("b"),
                nestedEnd: ranges[0].end === root.childNodes[6],
            };
        });
    });
    for (const item of result)
        expect(item).toEqual({
            unchanged: true,
            owned: true,
            nestedEnd: true,
            ranges: [
                {
                    first: "B",
                    last: "#comment",
                    empty: false,
                    startMarker: true,
                    endMarker: true,
                },
                {
                    first: "#comment",
                    last: "#comment",
                    empty: true,
                    startMarker: true,
                    endMarker: true,
                },
            ],
        });
});
