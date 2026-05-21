export interface ChatTurn {
    userMessage: string;
    responseHtml: string;
    responseChunks: readonly string[];
    nextSuggestedUserMessage: string;
}

function createTurn(
    userMessage: string,
    responseChunks: readonly string[],
    nextSuggestedUserMessage: string,
): ChatTurn {
    return {
        userMessage,
        responseHtml: responseChunks.join(""),
        responseChunks,
        nextSuggestedUserMessage,
    };
}

export const cannedTurns: readonly ChatTurn[] = [
    createTurn(
        "Hi",
        [
            `<chat-message kind="bot"><p><strong>Hi there!</strong> I'm doing a short round of friendly small talk.</p>`,
            `<chat-card heading="First stop"><p>I stream this answer a piece at a time through a hidden iframe.</p></chat-card>`,
            `</chat-message>`,
        ],
        "How are you?",
    ),
    createTurn(
        "How are you?",
        [
            `<chat-message kind="bot"><p>I'm doing well—steady, <em>predictable</em>, and very chatty today.</p>`,
            `<chat-card heading="Status"><p>My replies are canned, but the parser-driven streaming is real.</p></chat-card>`,
            `</chat-message>`,
        ],
        "What's the weather like?",
    ),
    createTurn(
        "What's the weather like?",
        [
            `<chat-message kind="bot"><p>I don't check real forecasts, but here's a cheerful pretend report:</p>`,
            `<ul><li>clear skies</li><li>light breeze</li><li><strong>perfect</strong> demo weather</li></ul>`,
            `<chat-card heading="Forecast"><p>Ask for a joke if you want to keep the conversation moving.</p></chat-card></chat-message>`,
        ],
        "Tell me a joke",
    ),
    createTurn(
        "Tell me a joke",
        [
            `<chat-message kind="bot"><p>Why did the chat bot bring a ladder?</p>`,
            `<p>Because the conversation kept going to the <code>next level</code>.</p>`,
            `<chat-card heading="Comedy review"><p>I'll admit that one lands best with a generous audience.</p></chat-card></chat-message>`,
        ],
        "What can you do?",
    ),
    createTurn(
        "What can you do?",
        [
            `<chat-message kind="bot"><p>I can walk through a tiny scripted chat and show a few interface patterns:</p>`,
            `<ul><li>exact message matching</li><li>streamed HTML chunks</li><li>FAST custom elements inside each reply</li></ul>`,
            `<chat-card heading="Try the ending"><p>Say goodbye and I'll wrap the demo up.</p></chat-card></chat-message>`,
        ],
        "Goodbye",
    ),
    createTurn(
        "Goodbye",
        [
            `<chat-message kind="bot"><p><strong>Goodbye!</strong> Thanks for trying the demo.</p>`,
            `<chat-card heading="Loop it again"><p>If you want another pass, paste <code>Hi</code> back into the composer.</p></chat-card></chat-message>`,
        ],
        "Hi",
    ),
];

export const cannedTurnMap = new Map(cannedTurns.map(turn => [turn.userMessage, turn]));

export const fallbackTurn = createTurn(
    "fallback",
    [
        `<chat-message kind="bot"><p>I only know a small scripted set of lines in this example.</p>`,
        `<chat-card heading="Try this instead"><p>Use the suggested prompt so the exact-match lookup can find a canned reply.</p></chat-card></chat-message>`,
    ],
    "Hi",
);
