import { customElement, html, css, FASTElement} from '@microsoft/fast-element';
import { mixin_cardStyles } from '../styles';

const template = html<AboutScreen>`
  <fluent-card>
    <h1>About</h1>
    <fluent-button appearance="accent">Call to Action</fluent-button>
  </fluent-card>
`;

const styles = css`
  fluent-card {
    ${mixin_cardStyles}
  }
`

@customElement({
  name: 'about-screen',
  template,
  styles
})
export class AboutScreen extends FASTElement {}