import { FASTElement, customElement, css, html } from "@microsoft/fast-element";
import { MainRouterConfig } from './routes';
import './components';
import { styles_fontFaces } from './typography';
import { inject } from "@microsoft/fast-foundation";

const template = html<MyApp>`
    <fluent-design-system-provider use-defaults>
        <header>
            <fluent-anchor href="/" appearance="lightweight">Home</fluent-anchor>
            <fluent-anchor href="/about" appearance="lightweight">About</fluent-anchor>
        </header>
        <fast-router :config=${x=> x.config}></fast-router>
    </fluent-design-system-provider>
`;

const styles = css`
    ${styles_fontFaces}
    
    header {
        padding: 20px;
    }
`

@customElement({
    name: "my-app",
    template,
    styles,
})
export class MyApp extends FASTElement {
    @inject(MainRouterConfig) config!: MainRouterConfig;
}
