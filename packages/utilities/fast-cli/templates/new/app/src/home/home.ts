import { customElement, html, css, FASTElement} from '@microsoft/fast-element';
import { mixin_cardStyles } from '../styles';

const template = html<HomeScreen>`
  <fluent-card>
    <h1>Home</h1>
    <fluent-button appearance="accent">Call to Action</fluent-button>
  </fluent-card>
`;

const styles = css`
  fluent-card {
    ${mixin_cardStyles}
  }
`

@customElement({
  name: 'home-screen',
  template,
  styles
})
export class HomeScreen extends FASTElement {}