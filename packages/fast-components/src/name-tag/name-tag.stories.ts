import { FASTNameTag } from ".";
import MarkTemplate from "./fixtures/mark.html";

// Prevent tree-shaking
FASTNameTag;

export default {
    title: "Name tag",
};

export const Mark = () => MarkTemplate;
