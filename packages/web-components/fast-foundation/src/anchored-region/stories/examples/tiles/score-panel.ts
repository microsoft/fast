import {
    bind,
    FASTElement,
    observable,
    ref,
    RepeatDirective,
    ViewBehaviorOrchestrator,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { css, ElementViewTemplate, html } from "@microsoft/fast-element";
import type { Orientation } from "@microsoft/fast-web-utilities";
import type { ARTile } from "./ar-tile.js";
import type { GameState } from "./interfaces.js";

export function registerScorePanel() {
    ScorePanel.define({
        name: "score-panel",
        template: scorePanelTemplate(),
        styles: scorePanelStyles,
    });
}

export interface ScoreWord {
    word: string;
    tiles: ARTile[];
    value: number;
    orientation: Orientation;
    isValid?: boolean;
}

/**
 *
 *
 * @public
 */
export class ScorePanel extends FASTElement {
    @observable
    public horizontalWords: ScoreWord[] = [];

    @observable
    public verticalWords: ScoreWord[] = [];

    @observable
    public bestGame: GameState;

    public verticalWordDisplay: HTMLDivElement;
    public horizontalWordDisplay: HTMLDivElement;

    private behaviorOrchestrator: ViewBehaviorOrchestrator | null = null;

    private verticalWordPlaceholder: Node | null = null;
    private horizontalWordPlaceholder: Node | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        this.verticalWordPlaceholder = document.createComment("");
        this.horizontalWordPlaceholder = document.createComment("");

        if (this.behaviorOrchestrator === null) {
            this.behaviorOrchestrator = ViewBehaviorOrchestrator.create(this);
            this.$fastController.addBehavior(this.behaviorOrchestrator);

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ScorePanel>(
                    bind(x => x.verticalWords, false),
                    bind(x => scoreWordTemplate, false),
                    {}
                ),
                this.verticalWordDisplay.appendChild(this.verticalWordPlaceholder)
            );

            this.behaviorOrchestrator.addBehaviorFactory(
                new RepeatDirective<ScorePanel>(
                    bind(x => x.horizontalWords, false),
                    bind(x => scoreWordTemplate, false),
                    {}
                ),
                this.horizontalWordDisplay.appendChild(this.horizontalWordPlaceholder)
            );
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}

const scoreWordTemplate: ViewTemplate<ScoreWord> = html`
    <fast-option
        class="
            score-word-option
            ${x =>
            x.isValid === true ? "valid" : x.isValid === false ? "invalid" : void 0}
        "
    >
        <div class="score-word-display">
            <div class="score-word-word">
                ${x => x.word}
            </div>
            <div class="score-word-score">
                ${x => x.value}
            </div>
        </div>
    </fast-option>
`;

/**
 * The template
 * @public
 */
export function scorePanelTemplate<T extends ScorePanel>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            ${when(
                x => x.bestGame,
                html`
                    <fast-button
                        class="best-game-button valid"
                        @click="${x => x.$emit("loadbestgame")}"
                    >
                        Your Best: ${x => x.bestGame.score}
                    </fast-button>
                `
            )}
            <h4>
                Vertical Words
            </h4>
            <fast-listbox
                class="score-word-listbox"
                ${ref("verticalWordDisplay")}
            ></fast-listbox>
            <h4>
                Horizontal Words
            </h4>
            <fast-listbox
                class="score-word-listbox"
                ${ref("horizontalWordDisplay")}
            ></fast-listbox>
        </template>
    `;
}

export const scorePanelStyles = css`
    :host {
    }

    .valid {
        background: green;
    }

    .invalid {
        background: red;
    }

    .score-word-listbox {
        width: 100%;
        min-height: 30px;
    }

    .score-word-option {
        height: 30px;
        width: 100%;
    }

    .score-word-option {
        height: 30px;
        width: 100%;
    }

    .score-word-option::part(content) {
        width: 100%;
    }

    .score-word-display {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
    }

    .score-word-word {
        grid-column: 1;
        grid-row: 1;
    }

    .score-word-score {
        grid-column: 2;
        grid-row: 1;
    }
`;
