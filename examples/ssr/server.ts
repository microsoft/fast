/* eslint-disable */
import "./dom";
import { render } from "@lit-labs/ssr/lib/render-lit-html";
import { Readable } from "stream";
import { FASTElementRenderer } from "./element-renderer";
import { myTemplate } from "./experience";

const templateResult = myTemplate();
const ssrResult = render(templateResult, {
    elementRenderers: [FASTElementRenderer],
    customElementHostStack: [],
    customElementInstanceStack: [],
});
const stream = (Readable as any).from(ssrResult);

stream.on("readable", function(this: any) {
    let data;

    while ((data = this.read())) {
        console.log(data);
    }
});
stream.on("close", () => process.exit(0));
stream.on("error", () => process.exit(1));
