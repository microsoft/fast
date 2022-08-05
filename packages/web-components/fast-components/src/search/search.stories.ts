import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import SearchTemplate from "./fixtures/search.html";
import "./index.js";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("search")) {
        document.querySelectorAll(".form").forEach((el: HTMLFormElement) => {
            el.onsubmit = event => {
                console.log(event, "event");
                event.preventDefault();
                const form: HTMLFormElement = event.target as HTMLFormElement;
                console.log(form.elements["fname"].value, "value of input");
            };
        });
    }
});

export default {
    title: "Search",
};

export const Search = () => SearchTemplate;
