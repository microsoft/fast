import { attr, FASTElement, customElement, observable, nullableNumberConverter, html, DOM } from '@microsoft/fast-element';
import { provideReactWrapper, ReactWrapperProps } from './index';
import React from "react";
import ReactDOM from "react-dom";
import { uniqueElementName } from '@microsoft/fast-foundation/dist/esm/test-utilities/fixture';
import { expect, assert } from "chai";

const elementName = uniqueElementName();
@customElement({
  name: elementName,
  template: html`<slot></slot>`
})
class ReactTestElement extends FASTElement {
  @observable bool = false;
  @observable str = '';
  @observable num = -1;
  @observable obj: {[index: string]: unknown} | null | undefined = null;
  @observable arr: unknown[] | null | undefined = null;
  @attr({ mode: "boolean" }) rbool = false;
  @attr rstr = '';
  @attr({ converter: nullableNumberConverter }) rnum = -1;
}

describe('wrap', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  const restTestEvents = {
    onFoo: 'foo',
    onBar: 'bar',
  };

  const { wrap } = provideReactWrapper(React);

  const ReactTestComponent = wrap(
    ReactTestElement,
    { events: restTestEvents }
  );

  let el: ReactTestElement;

  const renderReactComponent = (
    props?: ReactWrapperProps<ReactTestElement, typeof restTestEvents> & { ref?: any}
  ) => {
    ReactDOM.render(
      <ReactTestComponent {...props}/>,
      container
    );
    el = container.querySelector(elementName)! as ReactTestElement;
  };

  it('works with text children', async () => {
    const name = 'World';
    ReactDOM.render(
      <ReactTestComponent>Hello {name}</ReactTestComponent>,
      container
    );
    el = container.querySelector(elementName)! as ReactTestElement;
    expect(el.textContent).to.equal('Hello World');
  });

  it('wrapper renders custom element that updates', async () => {
    renderReactComponent();
    assert.isOk(el);
    assert.isOk(el.$fastController.isConnected);
  });

  it('can get ref to element', async () => {
    const elementRef1 = React.createRef();
    renderReactComponent({ref: elementRef1});
    assert.equal(elementRef1.current, el);
    const elementRef2 = React.createRef();
    renderReactComponent({ref: elementRef2});
    assert.equal(elementRef1.current, null);
    assert.equal(elementRef2.current, el);
    renderReactComponent({ref: elementRef1});
    assert.equal(elementRef1.current, el);
    assert.equal(elementRef2.current, null);
  });

  it('can get ref to element via callbacks', async () => {
    const ref1Calls: Array<string | undefined> = [];
    const refCb1 = (e: Element | null) => ref1Calls.push(e?.localName);
    const ref2Calls: Array<string | undefined> = [];
    const refCb2 = (e: Element | null) => ref2Calls.push(e?.localName);
    renderReactComponent({ref: refCb1});
    assert.deepEqual(ref1Calls, [elementName]);
    renderReactComponent({ref: refCb2});
    assert.deepEqual(ref1Calls, [elementName, undefined]);
    assert.deepEqual(ref2Calls, [elementName]);
    renderReactComponent({ref: refCb1});
    assert.deepEqual(ref1Calls, [elementName, undefined, elementName]);
    assert.deepEqual(ref2Calls, [elementName, undefined]);
  });

  it('can set attributes', async () => {
    await renderReactComponent({id: 'id'});
    assert.equal(el.getAttribute('id'), 'id');
    await renderReactComponent({id: undefined});
    assert.equal(el.getAttribute('id'), null);
    await renderReactComponent({id: 'id2'});
    assert.equal(el.getAttribute('id'), 'id2');
  });

  it('can set properties', async () => {
    let o = {foo: true};
    let a = [1, 2, 3];
    await renderReactComponent({
      bool: true,
      str: 'str',
      num: 5,
      obj: o,
      arr: a,
    });
    assert.equal(el.bool, true);
    assert.equal(el.str, 'str');
    assert.equal(el.num, 5);
    assert.deepEqual(el.obj, o);
    assert.deepEqual(el.arr, a);
    const firstEl = el;
    // update
    o = {foo: false};
    a = [1, 2, 3, 4];
    await renderReactComponent({
      bool: false,
      str: 'str2',
      num: 10,
      obj: o,
      arr: a,
    });
    assert.equal(firstEl, el);
    assert.equal(el.bool, false);
    assert.equal(el.str, 'str2');
    assert.equal(el.num, 10);
    assert.deepEqual(el.obj, o);
    assert.deepEqual(el.arr, a);
  });

  it('can set properties that reflect', async () => {
    renderReactComponent({
      rbool: true,
      rstr: 'str',
      rnum: 5,
    });

    await DOM.nextUpdate();

    const firstEl = el;
    assert.equal(el.rbool, true);
    assert.equal(el.rstr, 'str');
    assert.equal(el.rnum, 5);
    assert.equal(el.getAttribute('rbool'), '');
    assert.equal(el.getAttribute('rstr'), 'str');
    assert.equal(el.getAttribute('rnum'), '5');
    // update

    renderReactComponent({
      rbool: false,
      rstr: 'str2',
      rnum: 10,
    });

    await DOM.nextUpdate();

    assert.equal(firstEl, el);
    assert.equal(el.rbool, false);
    assert.equal(el.rstr, 'str2');
    assert.equal(el.rnum, 10);
    assert.equal(el.getAttribute('rbool'), null);
    assert.equal(el.getAttribute('rstr'), 'str2');
    assert.equal(el.getAttribute('rnum'), '10');
  });

  it('can listen to events', async () => {
    let fooEvent: Event | undefined,
      fooEvent2: Event | undefined,
      barEvent: Event | undefined;
    const onFoo = (e: Event) => {
      fooEvent = e;
    };
    const onFoo2 = (e: Event) => {
      fooEvent2 = e;
    };
    const onBar = (e: Event) => {
      barEvent = e;
    };
    await renderReactComponent({
      onFoo,
      onBar,
    });
    el.$emit('foo');
    assert.equal(fooEvent!.type, 'foo');
    el.$emit('bar');
    assert.equal(barEvent!.type, 'bar');
    fooEvent = undefined;
    barEvent = undefined;
    await renderReactComponent({
      onFoo: undefined,
    });
    el.$emit('foo');
    assert.equal(fooEvent, undefined);
    el.$emit('bar');
    assert.equal(barEvent!.type, 'bar');
    fooEvent = undefined;
    barEvent = undefined;
    await renderReactComponent({
      onFoo,
    });
    el.$emit('foo');
    assert.equal(fooEvent!.type, 'foo');
    el.$emit('bar');
    assert.equal(barEvent!.type, 'bar');
    await renderReactComponent({
      onFoo: onFoo2,
    });
    fooEvent = undefined;
    fooEvent2 = undefined;
    el.$emit('foo');
    assert.equal(fooEvent, undefined);
    assert.equal(fooEvent2!.type, 'foo');
    await renderReactComponent({
      onFoo,
    });
    fooEvent = undefined;
    fooEvent2 = undefined;
    el.$emit('foo');
    assert.equal(fooEvent!.type, 'foo');
    assert.equal(fooEvent2, undefined);
  });

  it('can listen to native events', async () => {
    let clickEvent!: React.MouseEvent;
    await renderReactComponent({
      onClick(e: React.MouseEvent) {
        e.persist();
        clickEvent = e;
      },
    });
    el.click();
    assert.equal(clickEvent?.type, 'click');
  });

  it('can set children', async () => {
    const children = (React.createElement(
      'div'
      // Note, constructing children like this is rare and the React type expects
      // this to be an HTMLCollection even though that's not the output of
      // `createElement`.
    ) as unknown) as HTMLCollection;
    await renderReactComponent({children});
    assert.equal(el.childNodes.length, 1);
    assert.equal(el.firstElementChild!.localName, 'div');
  });

  it('can set reserved React properties', async () => {
    await renderReactComponent({
      style: {display: 'block'},
      className: 'foo bar',
    } as any);
    assert.equal(el.style.display, 'block');
    assert.equal(el.getAttribute('class'), 'foo bar');
  });

  it('warns if element contains reserved props', async () => {
    const warn = console.warn;
    let warning: string;
    console.warn = (m: string) => {
      warning = m;
    };

    @customElement(uniqueElementName())
    class Warn extends FASTElement {
      @attr ref = 'hi';
    }

    const { wrap } = provideReactWrapper(React);
    const WarningComponent = wrap(Warn);

    ReactDOM.render(
      <WarningComponent></WarningComponent>,
      container
    );

    assert.include(warning!, 'ref');
    console.warn = warn;
  });
});
