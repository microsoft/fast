import {
    customElement,
    FASTElement,
    html,
    observable,
    when,
} from "@microsoft/fast-element";

const templates = {
    depressed: html`
        <div>
            <span>I'm so depressed :O</span>
        </div>
    `,
    sad: html`
        <div>
            <span>I'm so sad :(</span>
        </div>
    `,
    happy: html`
        <div>
            <span>I'm so happy :)</span>
        </div>
    `,
    ecstatic: html`
        <div>
            <span>I'm so ecstatic :D</span>
        </div>
    `,
    indifferent: html`
        <div>
            <span>I'm indifferent :|</span>
        </div>
    `,
};

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            <button @click="${x => x.update()}">Click Me</button>
            ${when(x => x.emotionLevel <= 1, templates.depressed)}
            ${when(x => x.emotionLevel === 2 || x.emotionLevel === 3, templates.sad)}
            ${when(
                x => x.emotionLevel === 4 || x.emotionLevel === 5,
                templates.indifferent
            )}
            ${when(x => x.emotionLevel >= 6 && x.emotionLevel < 9, templates.happy)}
            ${when(
                x => x.emotionLevel === 9 || x.emotionLevel === 10,
                templates.ecstatic
            )}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable emotionLevel: number = 0;

    update() {
        this.emotionLevel = this.emotionLevel === 10 ? 0 : this.emotionLevel + 1;
    }
}
