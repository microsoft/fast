import { FASTNameTag } from ".";
import MarkTemplate from "./fixtures/mark.html";

try {
    // Prevent tree-shaking
    FASTNameTag;
} catch (e) {
    alert(e);
}

export default {
    title: "Name tag",
};

export const Mark = () => MarkTemplate;
