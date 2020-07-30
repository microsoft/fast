import { FASTElement, html, observable, customElement, css } from '@microsoft/fast-element';
import { FASTTextField } from '@microsoft/fast-components-msft';

const template = html<TodoForm>`
  <form>
    <fast-text-field value=${x => x.nextDescription} @change=${(x, c) => x.onDescriptionChange(c.event)}></fast-text-field>
    <fast-button appearance="accent" ?disabled=${x => x.addTodoDisabled} @click=${x => x.submitTodo()}>Add Todo</fast-button>
  </form>
`;

const styles = css`
  form {
    display: flex;
  }

  fast-button {
    margin: 4px;
  }
`;

@customElement({
  name: 'todo-form',
  template,
  styles
})
export class TodoForm extends FASTElement {
  @observable public nextDescription: string = '';

  get addTodoDisabled() {
    return !this.nextDescription;
  }
  
  public submitTodo() {
    if (this.addTodoDisabled) {
      return;
    }

    this.$emit('todo-submit', this.nextDescription);
    this.nextDescription = '';
  }

  public onDescriptionChange(event: Event) {
    this.nextDescription = (event.target! as FASTTextField).value;
  }
}