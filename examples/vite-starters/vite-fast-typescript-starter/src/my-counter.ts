import {
    html,
    css,
    customElement,
    observable,
    FASTElement,
} from "@microsoft/fast-element";

const template = html<MyCounter>`
    <button @click="${x => (x.count = Math.max(0, x.count - 1))}">-</button>
    <span>${x => x.count}</span>
    <button @click="${x => x.count++}">+</button>
`;

const styles = css`
  button, span {
    font-family: inherit;
    font-size: 32px;
  }
  span {
    width: 4rem;
    display: inline-block;
    text-align: center;
  }
  button {
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    width: 42px;
    height: 42px;
    background-color: #c01754;
    color: white;
  }
  button:hover {
    cursor: pointer;
    background-color: #da1a5f;
  }
  button:focus-visible {
    border 1px solid #000;
    box-shadow: #707070 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset;
    outline: none;
  }
`;

@customElement({
    name: "my-counter",
    template,
    styles,
})
export class MyCounter extends FASTElement {
    @observable
    public count: number = 0;
}
