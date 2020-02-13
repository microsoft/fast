export default {
    title: "Demo",
};

export const Example: () => HTMLElement = (): HTMLElement => {
    const btn: HTMLButtonElement = document.createElement("button");
    btn.type = "button";
    btn.innerText = "Hello Button";
    btn.addEventListener("click", (e: MouseEvent) => window.alert("Clicked!"));

    return btn;
};
