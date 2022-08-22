import { customElement, FASTElement, html, observable } from "@microsoft/fast-element";

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
            ${x => {
                switch (true) {
                    case x.emotionLevel > 8:
                        return templates.ecstatic;
                    case x.emotionLevel >= 6:
                        return templates.happy;
                    case x.emotionLevel <= 1:
                        return templates.depressed;
                    case x.emotionLevel < 4:
                        return templates.sad;
                    default:
                        return templates.indifferent;
                }
            }}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable emotionLevel: number = 0;

    update() {
        this.emotionLevel = this.emotionLevel === 10 ? 0 : this.emotionLevel + 1;
    }
}
