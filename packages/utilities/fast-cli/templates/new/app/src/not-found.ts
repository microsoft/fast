import { customElement, html, css, FASTElement} from '@microsoft/fast-element';

const template = html<NotFound>`
  <template>
    <h1>404 - Page Not Found</h1>
  </template>
`;

const styles = css`

`

@customElement({
  name: 'not-found',
  template,
  styles
})
export class NotFound extends FASTElement {}